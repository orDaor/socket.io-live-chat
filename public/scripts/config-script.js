//display init info
function disaplayInitInfo(title, info, action, optionalAction) {
  if (!info) {
    return;
  }

  initInfoSectionElement.style.display = "block";
  initInfoSectionElement.innerHTML = getHtmlContentInitInfo(
    title,
    info,
    action,
    optionalAction
  );
}

// hide init info
function hideInitInfo() {
  initInfoSectionElement.textContent = "";
  initInfoSectionElement.style.display = "none";
}

//display sign up/in form
function displaySignUpInForm(action) {
  hideSignUpInForm();

  //the form to be creating can only be used for logging in or signin up
  if (action !== "Login" && action !== "Signup") {
    return;
  }

  let alternativeAction;
  if (action === "Login") {
    alternativeAction = "Signup";
  } else if (action === "Signup") {
    alternativeAction = "Login";
  }

  //create and display the form
  signUpInSectionElement.style.display = "block";
  signUpInSectionElement.innerHTML = getHtmlContentSignUpInForm(
    action,
    alternativeAction
  );
  let authenticationProcess;
  if (action === "Login") {
    authenticationProcess = login;
  } else if (action === "Signup") {
    authenticationProcess = signup;
  }
  signUpInSectionElement
    .querySelector("form")
    .addEventListener("submit", authenticationProcess);
}

//hide sign up/in form
function hideSignUpInForm() {
  signUpInSectionElement.textContent = "";
  signUpInSectionElement.style.display = "none";
}

//display error info on authentication form
function displayAuthErrorInfo(info) {
  hideAuthErrorInfo();
  const errorInfoElement = document.createElement("p");
  errorInfoElement.classList.add("auth-error-info");
  errorInfoElement.textContent = info;
  signUpInSectionElement.querySelector("form").prepend(errorInfoElement);
}

//hide auth error info on authentication form
function hideAuthErrorInfo() {
  const authErrorInfoElement =
    signUpInSectionElement.querySelector(".auth-error-info");
  if (authErrorInfoElement) {
    authErrorInfoElement.parentElement.removeChild(authErrorInfoElement);
  }
}

//display friends section on desktop
function displayFriendsAndChatSectionOnWidhtChange(event) {
  //only if auth form and init info are not visible, it is possible to
  //manipulate the visibility of
  const isALlowed =
    (signUpInSectionElement.style.display === "none" ||
      signUpInSectionElement.textContent === "") &&
    (initInfoSectionElement.style.display === "none" ||
      initInfoSectionElement.textContent === "") &&
    !document.getElementById("main-loader");

  if (!isALlowed) {
    return;
  }

  //window >= 768px
  if (window.innerWidth >= 768) {
    if (selectedChatItemGlobal) {
      displayFriendsSection();
      displayChatSection();
    }
  } else {
    if (
      friendsSectionElement.style.display === "block" &&
      chatSectionElement.style.display === "none"
    ) {
      displayFriendsSection();
      hideChatSection();
    } else if (
      friendsSectionElement.style.display === "none" &&
      chatSectionElement.style.display === "flex"
    ) {
      hideFriendsSection();
      displayChatSection();
    } else if (
      friendsSectionElement.style.display === "block" &&
      chatSectionElement.style.display === "flex"
    ) {
      if (selectedChatItemGlobal) {
        hideFriendsSection();
        displayChatSection();
      } else {
        displayFriendsSection();
        hideChatSection();
      }
    }
  }

  //mark selected chat item as read when screen gets bigger
  if (window.innerWidth >= 768 && selectedChatItemGlobal) {
    if (selectedChatItemGlobal.classList.contains("friend-chat-item-unread")) {
      setChatItemAsRead(selectedChatItemGlobal);
      const chatGlobal = getChatGlobalByRoomId(
        selectedChatItemGlobal.dataset.roomId
      );
      if (!chatGlobal.viewed) {
        updateNewMessagesCount("decrement");
      }
      chatGlobal.viewed = true;
      //tell the server the user is viewing new content for this chat
      registerOneChatView(selectedChatItemGlobal.dataset.roomId);
    }
    scrollToBottomOfMessagesList("auto");
  }
}

//display active friends and form
function displayActiveFriendsAndForm() {
  chatSectionElement.querySelector(".active-friends").style.display = "flex";
  chatSectionElement.querySelector(".chat-actions").style.display = "flex";
}

//display active friends and form
function hideActiveFriendsAndForm() {
  chatSectionElement.querySelector(".active-friends").style.display = "none";
  chatSectionElement.querySelector(".chat-actions").style.display = "none";
}

//scroll to the bottom of the chat list
function scrollToBottomOfMessagesList(scrollBehavior) {
  const messagesListElement = chatSectionElement.querySelector("ul");
  messagesListElement.scrollTo({
    top: messagesListElement.scrollHeight,
    left: 0,
    behavior: scrollBehavior,
  });
}

//hide friends section
function hideFriendsSection() {
  friendsSectionElement.style.display = "none";
}

//display friends section
function displayFriendsSection() {
  //show this section
  friendsSectionElement.style.display = "block";
}

//display chat section
function displayChatSection() {
  chatSectionElement.style.display = "flex";
}

//hide chat section
function hideChatSection() {
  chatSectionElement.style.display = "none";
}

//display the friends list and hide chat
function displayFriendsAndHideChat() {
  displayFriendsSection();
  hideChatSection();
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
  const isErrorMessage = true;
  displayOneMessage(isErrorMessage, null, info, null, true, "smooth");
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

//create and display the main page loader
function displayMainLoader() {
  const loaderElement = document.createElement("div");
  loaderElement.classList.add("loader");
  loaderElement.id = "main-loader";
  document.querySelector("main").append(loaderElement);
}

//remove the main page loader
function hideMainLoader() {
  const loaderElement = document.getElementById("main-loader");
  if (loaderElement) {
    loaderElement.parentElement.removeChild(loaderElement);
  }
}
