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
      displayOneMessageErrorInfo(displayedMessage, message.sendingFailedReason);
    }

    //be sure to scroll to the bottom after message + possible error message were displayed
    scrollToBottomOfMessagesList(scrollBahavior);
  }
}

//clean all messages
function cleanAllMessages() {
  //remove the list element and re-create it
  const messagesListElement = chatSectionElement.querySelector("ul");
  messagesListElement.textContent = "";
  return messagesListElement;
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
  const activeFriendsContentElement = chatSectionElement.querySelector(
    ".active-friends .active-friends-content"
  );
  const isTypingElement = document.createElement("p");
  isTypingElement.classList.add("is-typing-info");
  isTypingElement.textContent = "typing...";
  activeFriendsContentElement.append(isTypingElement);
}

//hide "is typing" info tight above the text area
function hideIsTypingInfo() {
  const isTypingElement = chatSectionElement.querySelector(
    ".active-friends .is-typing-info"
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
//NOTE: last = last in the messages array
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

//get chat global first message date
//NOTE: first = first in the messages array
function getChatGlobalEldestMessage(chat) {
  //no messages in this chat
  const messagesNumber = chat.messages.length;
  if (!messagesNumber) {
    return undefined;
  }

  for (const message of chat.messages) {
    //this messages was deleted from the DB
    const deleted =
      !message.creationDate && !message.messageId && !message.text;

    //this message faild sending
    const sendingFailed = message.sendingFailed;

    //skip deleted or failed messages
    if (!deleted && !sendingFailed) {
      return message;
    }
  }
  //no "good" message was found
  return undefined;
}

//reset text area element
function resetTextAreaElement() {
  const textAreaElement = chatSectionElement.querySelector(
    ".chat-actions textarea"
  );
  textAreaElement.scrollTop = 0;
  textAreaElement.rows = 1;
  textAreaElement.value = "";
  textAreaElement.style.height = "";
  return textAreaElement;
}

//init text area value
function initTextAreaValue(value) {
  const textAreaElement = resetTextAreaElement();
  textAreaElement.value = value;
  fitTextAreaHeightToText(textAreaElement);
}

//adapt text area height
function fitTextAreaHeightToText(textArea) {
  //update height
  textArea.style.height = "";
  textArea.style.height = Math.min(textArea.scrollHeight, 54) + "px";
  textArea.scrollTop = textArea.scrollHeight;
}

//meomrize current input for the selected chat
function cacheCurrentInput(textArea) {
  //current chat
  const roomId =
    chatSectionElement.querySelector(".active-friends").dataset.roomId;

  //target chat global
  const chatGlobal = getChatGlobalByRoomId(roomId);
  chatGlobal.currentInput = textArea.value;
}

//user can not select any chat other that the given one with roomId
function keepUserOnSelectedChat(selectedRoomId) {
  //style other chats are disabled
  const chatItems = friendsSectionElement.querySelectorAll(".friend-chat-item");
  for (const chat of chatItems) {
    if (chat.dataset.roomId !== selectedRoomId) {
      chat.classList.add("friend-chat-item-disabled");
    }
  }

  //disable "back to friends list" button on mobile
  disableButtons([backToChatListButton], true);
}

//let use select other chats
function letUserSelectOtherChats() {
  //style other chats are disabled
  const chatItems = friendsSectionElement.querySelectorAll(".friend-chat-item");
  for (const chat of chatItems) {
    chat.classList.remove("friend-chat-item-disabled");
  }

  //enable "back to friends list" button on mobile
  disableButtons([backToChatListButton], false);
}
