//display init info
function disaplayInitInfo(info) {
  if (!info) {
    return;
  }

  initInfoSectionElement.style.display = "block";
  initInfoSectionElement.innerHTML = getHtmlContentInitInfo(info);

  //DELETE below !! !
  hideFriendsSection();
  hideChatSection();
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

  //DELETE below !! !
  hideFriendsSection();
  hideChatSection();
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
  hideMainErrorInfo();
  const isErrorMessage = true;
  displayOneMessage(isErrorMessage, null, info, null, true, false);
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
      message.removeChild(messageItemError);
      //remove also line break
      const lineBreak = message.querySelector(".line-break-control");
      message.removeChild(lineBreak);
      return;
    }
  }
}

//create and display the main page loader
function displayMainLoader() {
  const loaderElement = document.createElement("div");
  loaderElement.classList.add("loader");
  loaderElement.id = "main-loader";
  document.querySelector("main").append(loaderElement);

  //DELETE below !! !
  hideFriendsSection();
  hideChatSection();
}

//remove the main page loader
function removeMainLoader() {
  const loaderElement = document.getElementById("main-loader");
  if (loaderElement) {
    loaderElement.parentElement.removeChild(loaderElement);
  }
}
