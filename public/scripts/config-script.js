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
  //only if auth form or init info are not visible
  if (
    (signUpInSectionElement.style.display === "none" ||
      signUpInSectionElement.textContent === "") &&
    (initInfoSectionElement.style.display === "none" ||
      initInfoSectionElement.textContent === "") &&
    !document.getElementById("main-loader")
  ) {
    //window >= 768px
    if (window.innerWidth >= 768) {
      displayFriendsSection();
      displayChatSection();
    } else {
      displayFriendsSection();
      hideChatSection();
    }
  }
}

//scroll to the bottom of the chat list
function scrollToBottomOfMessagesList() {
  const messagesListElement = chatSectionElement.querySelector("ul");
  messagesListElement.scrollTo({
    top: messagesListElement.scrollHeight,
    left: 0,
    behavior: "smooth",
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

  //how many chats exist for this uer
  const chatsList = friendsSectionElement.querySelectorAll(".friend-chat-item");

  //if no chats exist static position should apply
  if (!chatsList.length) {
    if (window.innerWidth >= 768) {
      friendsSectionElement.style.position = "static";
      friendsSectionElement.style.margin = "4rem auto";
      friendsSectionElement.style.width = "27rem";
    } else {
      friendsSectionElement.style.width = "";
      friendsSectionElement.style.position = "";
      friendsSectionElement.style.margin = "";
    }
  }
}

//display chat section
function displayChatSection() {
  const chatList = friendsSectionElement.querySelectorAll(".friend-chat-item");
  if (chatList.length > 0) {
    chatSectionElement.style.display = "flex";
  }
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
  displayOneMessage(isErrorMessage, null, info, null, null, true);
}

//display error info for one message
function displayOneMessageErrorInfo(messageId, info) {
  const messages = document.querySelectorAll(".message-item");
  for (const message of messages) {
    if (message.dataset.messageId === messageId) {
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
      if (messageItemError) {
        message.removeChild(messageItemError);
        //remove also line break
        const lineBreak = message.querySelector(".line-break-control");
        message.removeChild(lineBreak);
        return;
      }
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
