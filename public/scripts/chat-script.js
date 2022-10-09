//add a message in the chat
//NOTE: side = "left" or "right"
function displayOneMessage(
  isErrorMessage,
  messageId,
  text,
  creationDate, //TODO
  side,
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
  spanMessageTextElement.textContent = text;
  messageTextElement.appendChild(spanMessageTextElement);
  messageListItemElement.appendChild(messageTextElement);
  //append the list item element inside the messages list
  const messagesListElement = chatSectionElement.querySelector("ul");
  messagesListElement.appendChild(messageListItemElement);

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

  //scroll the message list at the bottom
  if (autoScrollToBottom) {
    scrollToBottomOfMessagesList(scrollBehavior);
  }
}

//display array of messages received on the socket
function displayAllMessages(messages, scrollBahavior) {
  //clean current messages
  cleanAllMessages();
  //loop through received messages
  for (const message of messages) {
    //display on left if friend is sender, display on right if this user is the sender
    //NOTE: we scroll after all messages are loaded
    if (message.senderIsViewer) {
      displayOneMessage(
        false,
        message.messageId,
        message.text,
        message.creationDate,
        "right",
        false
      );
    } else {
      displayOneMessage(
        false,
        "",
        message.text,
        message.creationDate,
        "left",
        false
      );
    }
  }

  //scroll to the bottom
  scrollToBottomOfMessagesList(scrollBahavior);
}

//clean all messages
function cleanAllMessages() {
  chatSectionElement.querySelector("ul").textContent = "";
}

//delete a message from screen
function hideOneMessage(messageId) {
  const messages = document.querySelectorAll(".message-item");
  for (const message of messages) {
    if (message.dataset.messageId === messageId) {
      message.parentElement.removeChild(message);
      return;
    }
  }
}

//set message id on the page
function setMessageId(messageId, tempMessageId) {
  const messages = document.querySelectorAll(".message-item");
  for (const message of messages) {
    if (message.dataset.messageId === tempMessageId) {
      message.dataset.messageId = messageId;
      return;
    }
  }
}
