//set active room id
function setActiveChatRoomId(roomId) {
  chatSectionElement.querySelector(".active-friends").dataset.roomId = roomId;
}

//set active friend name
function setActiveFriendName(activeFriendName) {
  const activeFriendNameElement = chatSectionElement.querySelector(
    ".active-friends .friend-chat-name"
  );
  activeFriendNameElement.textContent = activeFriendName;
}

//set active chat online status
function setActiveChatOnlineStatus(selectedChatStatusElement) {
  const activeChatStatus = chatSectionElement.querySelector(
    ".active-friends .friend-chat-status"
  );
  if (
    selectedChatStatusElement.classList.contains("friend-chat-status-online")
  ) {
    activeChatStatus.classList.add("friend-chat-status-online");
    activeChatStatus.classList.remove("friend-chat-status-offline");
  } else if (
    selectedChatStatusElement.classList.contains("friend-chat-status-offline")
  ) {
    activeChatStatus.classList.add("friend-chat-status-offline");
    activeChatStatus.classList.remove("friend-chat-status-online");
  }
}

//add a message in the chat
//NOTE: side = "left" or "right"
function displayOneMessage(
  isErrorMessage,
  messageId,
  text,
  side,
  position,
  autoScrollToBottom,
  scrollBehavior
) {
  //create a list item element
  const messageListItemElement = document.createElement("li");
  messageListItemElement.classList.add("message-item");

  if (isErrorMessage) {
    messageListItemElement.classList.add(
      "message-item-left",
      "main-error-info"
    );
  } else {
    messageListItemElement.classList.add(`message-item-${side}`);
    messageListItemElement.dataset.messageId = messageId;
  }

  //create a paragraph element inside the list item element
  const messageTextElement = document.createElement("p");
  const spanMessageTextElement = document.createElement("span");
  spanMessageTextElement.classList.add("message-text");
  spanMessageTextElement.textContent = text;
  messageTextElement.appendChild(spanMessageTextElement);
  messageListItemElement.appendChild(messageTextElement);

  //if it is error message display an "x" for closing it
  if (isErrorMessage) {
    const closeErrorMessageSpanElement = document.createElement("span");
    closeErrorMessageSpanElement.classList.add("closing-message-symbol");
    closeErrorMessageSpanElement.textContent = "X";
    closeErrorMessageSpanElement.addEventListener("click", hideMainErrorInfo);
    messageListItemElement
      .querySelector("p")
      .appendChild(closeErrorMessageSpanElement);
  }

  //for normal message display also action button on the message for deleting it or re-sending it
  if (!isErrorMessage && side === "right") {
    const messageActionElement = document.createElement("div");
    messageActionElement.innerHTML = htmlContentEditMessageIcon;
    messageActionElement.classList.add("message-item-action");
    messageActionElement.addEventListener("click", displayMessageActions);
    messageTextElement.appendChild(messageActionElement);
  }

  //append or prepend the list item element inside the messages list
  const messagesListElement = chatSectionElement.querySelector("ul");
  if (position === "append") {
    messagesListElement.appendChild(messageListItemElement);
  } else if (position === "prepend") {
    messagesListElement.prepend(messageListItemElement);
  } else {
    //default append
    messagesListElement.appendChild(messageListItemElement);
  }

  //scroll the message list at the bottom
  if (autoScrollToBottom) {
    scrollToBottomOfMessagesList(scrollBehavior);
  }

  return messageListItemElement;
}

//display array of messages received on the socket
function displayAllMessages(messages, scrollBahavior) {
  const errorInfo = "An error occured";
  //clean current messages
  cleanAllMessages();
  //loop through received messages
  for (const message of messages) {
    //if this message was deleted (main values were cleaned in the frontend), don Not display it
    const messageWasDeleted =
      !message.creationDate && !message.messageId && !message.text;
    if (messageWasDeleted) {
      //move to next message
      continue;
    }

    //display on left if friend is sender, display on right if this user is the sender
    let side;
    if (message.senderIsViewer) {
      side = "right";
    } else {
      side = "left";
    }

    //display message
    const displayedMessage = displayOneMessage(
      false,
      message.messageId,
      message.text,
      side,
      "append",
      false
    );

    //if the message sending failed display error info under the message
    if (message.sendingFailed) {
      displayOneMessageErrorInfo(displayedMessage, errorInfo);
    }
  }

  //scroll to the bottom
  scrollToBottomOfMessagesList(scrollBahavior);
}

//clean all messages
function cleanAllMessages() {
  //remove the list element and re-create it
  const messagesListElement = chatSectionElement.querySelector("ul");
  messagesListElement.textContent = "";
}

//delete a message from screen
function hideOneMessage(message) {
  message.parentElement.removeChild(message);
}

//set message id on the page
function setMessageId(message, messageId) {
  message.dataset.messageId = messageId;
}

//display "is typing" info tight above the text area
function displayIsTypingInfo() {
  const chatForm = chatSectionElement.querySelector(".chat-actions");
  const isTypingElement = document.createElement("p");
  isTypingElement.classList.add("is-typing-info");
  isTypingElement.textContent = "typing...";
  chatForm.append(isTypingElement);
}

//hide "is typing" info tight above the text area
function hideIsTypingInfo() {
  const isTypingElement = chatSectionElement.querySelector(
    ".chat-actions .is-typing-info"
  );
  if (isTypingElement) {
    isTypingElement.parentElement.removeChild(isTypingElement);
  }
}

//get message item by room id
function getMessageItemByMessageId(messageId) {
  const messages = chatSectionElement.querySelectorAll(".message-item");
  for (const message of messages) {
    if (message.dataset.messageId === messageId) {
      return message;
    }
  }
}

//get a specific message of a given chat in chatListGlobal
function getChatGlobalMessageByMessageId(chat, messageId) {
  for (const message of chat.messages) {
    if (message.messageId === messageId) {
      return message;
    }
  }
}

//get last message of a chat in chat list global
function getChatGlobalLastMessageText(chat) {
  //no messages in this chat
  const messagesNumber = chat.messages.length;
  if (!messagesNumber) {
    return "No messages yet";
  }

  //at least one message is preent, then get the text of the last not cleaned / non empty (not deleted message)
  let messageIndex = messagesNumber - 1;
  let message = chat.messages[messageIndex];
  while (!message.creationDate && !message.messageId && !message.text) {
    //move back of one message, and check if this is empty too
    messageIndex--;
    if (messageIndex <= -1) {
      return "No messages yet";
    }
    message = chat.messages[messageIndex];
  }

  //this is the last non empty message, then return its text
  return message.text;
}

//get number  of cleaned (deleted) messages in a chat in chatListGlobal
function getActualChatGlobalMessagesNumber(chat) {
  let counter = 0;
  for (const message of chat.messages) {
    const deleted =
      !message.creationDate && !message.messageId && !message.text;
    const sendingFailed = message.sendingFailed;
    if (deleted || sendingFailed) {
      counter++;
    }
  }
  return counter;
}
