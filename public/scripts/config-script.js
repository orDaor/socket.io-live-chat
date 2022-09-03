//scroll to the bottom of the chat list
function scrollToBottomOfMessagesList() {
  const messagesListElement = chatSectionElement.querySelector("ul");
  messagesListElement.scrollTo({
    top: messagesListElement.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
}

//display chat section
function displayChatSection() {
  chatSectionElement.style.display = "flex";
}

//hide chat section
function hideChatSection() {
  chatSectionElement.style.display = "none";
}

//display message action opions (delete, resend...)
function displayMessageActions(event) {
  console.log("Message actions should be displayed (delete, resend...)");
}

//hide error info
function hideMainErrorInfo() {
  const mainErrorInfo = document.querySelector(".main-error-info");
  if (mainErrorInfo) {
    mainErrorInfo.parentElement.removeChild(mainErrorInfo);
  }
}

//display error message
function displayMainErrorInfo(info) {
  hideMainErrorInfo();
  const isErrorMessage = true;
  displayOneMessage(isErrorMessage, null, info, null, true, false);
}

//display error info for one message
function displayOneMessageErrorInfo(messageId, info) {
  const messages = document.querySelectorAll(".message-item");
  for (const message of messages) {
    if (message.dataset.messageId === messageId) {
      //find the message and add below it the error info
      const errorTextElement = document.createElement("p");
      errorTextElement.classList.add("message-item-error");
      const spanErrorTextELement = document.createElement("span");
      spanErrorTextELement.textContent = info;
      errorTextElement.append(spanErrorTextELement);
      message.append(errorTextElement);
      return;
    }
  }
}

//display error info for one message
function hideOneMessageErrorInfo(messageId) {
  const messages = document.querySelectorAll(".message-item");
  for (const message of messages) {
    if (message.dataset.messageId === messageId) {
      //find the message and remove its error info
      const messageItemError = message.querySelector(".message-item-error");
      messageItemError.parentElement.removeChild(messageItemError);
      return;
    }
  }
}
