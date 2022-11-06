//display error info on authentication form
function displayAuthErrorInfo(info) {
  hideAuthErrorInfo();
  const errorInfoElement = document.createElement("p");
  errorInfoElement.classList.add("auth-error-info");
  errorInfoElement.textContent = info;
  signUpInSectionElement.querySelector("form").append(errorInfoElement);
}

//hide auth error info on authentication form
function hideAuthErrorInfo() {
  const authErrorInfoElement =
    signUpInSectionElement.querySelector(".auth-error-info");
  if (authErrorInfoElement) {
    authErrorInfoElement.parentElement.removeChild(authErrorInfoElement);
  }
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
  const isErrorMessage = true;
  displayOneMessage(isErrorMessage, null, info, null, "append", true, "smooth");
}

//display error info for one message
function displayOneMessageErrorInfo(message, info) {
  //add a line break before the error info
  const lineBreakELement = document.createElement("p");
  lineBreakELement.classList.add("line-break-control");
  message.append(lineBreakELement);
  //find the message and add below it the error info
  const errorTextElement = document.createElement("p");
  errorTextElement.classList.add("message-item-error");
  const spanErrorTextELement = document.createElement("span");
  spanErrorTextELement.textContent = info;
  errorTextElement.append(spanErrorTextELement);
  message.append(errorTextElement);
}

//display error info for one message
function hideOneMessageErrorInfo(message) {
  //find the message and remove its error info
  const messageItemError = message.querySelector(".message-item-error");
  if (messageItemError) {
    message.removeChild(messageItemError);
    //remove also line break
    const lineBreak = message.querySelector(".line-break-control");
    if (lineBreak) {
      message.removeChild(lineBreak);
    }
  }
}

//display friends control error info
function displayFriendsControlErrorInfo(info) {
  const friendsControlElement =
    friendsSectionElement.querySelector(".friends-control");

  const friendsControlErrorContainerElement = document.createElement("div");
  friendsControlErrorContainerElement.classList.add("friends-control-error");

  const friendsControlErrorElement = document.createElement("p");
  friendsControlErrorElement.textContent = info;

  friendsControlErrorContainerElement.appendChild(friendsControlErrorElement);
  friendsControlElement.appendChild(friendsControlErrorContainerElement);
}

//hide friends control error info
function hideFriendsControlErrorInfo() {
  const friendsControlErrorElement = friendsSectionElement.querySelector(
    ".friends-control-error"
  );
  if (friendsControlErrorElement) {
    friendsControlErrorElement.parentElement.removeChild(
      friendsControlErrorElement
    );
  }
}

//display friends section list error info
//(tells the user if some any chat failed to laod)
function displayFriendsListErrorInfo(info) {
  const errorListItemElement = document.createElement("li");
  errorListItemElement.classList.add("friend-chat-item-error");

  const errorTextElement = document.createElement("p");
  errorTextElement.textContent = info;

  const closeErrorButtonELement = document.createElement("p");
  closeErrorButtonELement.textContent = "x";
  closeErrorButtonELement.classList.add("friend-chat-item-error-btn");
  closeErrorButtonELement.addEventListener("click", hideFriendsListErrorInfo);

  errorListItemElement.append(errorTextElement);
  errorListItemElement.append(closeErrorButtonELement);

  friendsSectionElement.querySelector("ul").prepend(errorListItemElement);
}

//hide friends section list error info
function hideFriendsListErrorInfo() {
  const errorListItemElement = friendsSectionElement.querySelector(
    "ul .friend-chat-item-error"
  );
  if (errorListItemElement) {
    errorListItemElement.parentElement.removeChild(errorListItemElement);
  }
}

//display init error info
function displayInitErrorInfo(info) {
  const initInfoElement = initInfoSectionElement.querySelector(".init-info");
  const errorInfoElement = document.createElement("p");
  errorInfoElement.textContent = info;
  errorInfoElement.classList.add("init-info-error");
  initInfoElement.appendChild(errorInfoElement);
}

//hide init error info
function hideInitErrorInfo() {
  const errorInfoElement = initInfoSectionElement.querySelector(
    ".init-info .init-info-error"
  );
  if (errorInfoElement) {
    errorInfoElement.parentElement.removeChild(errorInfoElement);
  }
}

//display modal error info
function displayModalErrorInfo(info) {
  const modalPromptElement = modalSectionElement.querySelector(
    ".modal .modal-prompt"
  );
  const errorInfoElement = document.createElement("p");
  errorInfoElement.textContent = info;
  errorInfoElement.classList.add("modal-prompt-error");
  modalPromptElement.appendChild(errorInfoElement);
}

//hide modal error info
function hideModalErrorInfo() {
  const errorInfoElement = modalSectionElement.querySelector(
    ".modal .modal-prompt .modal-prompt-error"
  );
  if (errorInfoElement) {
    errorInfoElement.parentElement.removeChild(errorInfoElement);
  }
}
