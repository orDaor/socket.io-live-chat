//log out
function logout(event) {
  //remove JWT and user name
  localStorage.removeItem("token");
  localStorage.removeItem("user-name");

  //clean all chat content
  cleanChatList();
  cleanAllMessages();
  hideFriendsControlErrorInfo();
  hideInvitationLink();

  //reset this user name active chat
  setUserName("");
  setActiveChatRoomId("");
  setActiveFriendName("");

  //disconnect socket
  socket.disconnect();

  //restart
  initializationDoneGlobal = false;
  chatListGlobal = [];
  selectedChatItemGlobal = undefined;
  selectedMessageItemGlobal = undefined;
  lastGeneratedInvitationLinkGlobal = "";
  disableDisplayOfScrollToBottomButton = false;
  disableLoadingOfMoreMessages = false;

  //user must login again to get a new token an re-open the socket
  hideFriendsSection();
  hideChatSection();
  displaySignUpInForm("Login");
}

//ajax request for requesting login
async function login(event) {
  event.preventDefault();

  //get form data
  const formData = new FormData(event.target);
  const userLoginData = {
    userName: formData.get("username"),
    password: formData.get("password"),
  };

  //config ajax request for log in
  const requestUrl = `/user/login`;
  const requestConfig = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    },
    method: "POST",
    body: JSON.stringify(userLoginData),
  };

  //show loader and disable buttons
  hideAuthErrorInfo();
  const buttons = event.target.querySelectorAll("button");
  displaySignUpInFormLoader();
  disableButtons(buttons, true);

  //send ajax request for login
  let response;
  try {
    response = await fetch(requestUrl, requestConfig);
  } catch (error) {
    displayAuthErrorInfo(
      "Can not reach the server. May check your connection?"
    );
    //hide loader and re-enable buttons
    hideOneLoader("sign-up-in-form-loader");
    disableButtons(buttons, false);
    return;
  }

  //a response was received, hide loader and re-enable buttons
  hideOneLoader("sign-up-in-form-loader");
  disableButtons(buttons, false);

  //parse response
  const responseData = await response.json();

  //response not ok
  if (!response.ok) {
    displayAuthErrorInfo(responseData.message);
    return;
  }

  //invalid credentials
  if (responseData.invalidCredentials) {
    displayAuthErrorInfo(responseData.message);
    return;
  }

  //login was ok, get and memorize JWT and user name
  localStorage.setItem("token", responseData.token);
  localStorage.setItem("user-name", responseData.userName);

  //display user name
  setUserName(responseData.userName);

  //initialize after login
  if (invitationInfoElement) {
    hideSignUpInForm();
    handleInvitationRequest(invitationInfoElement.dataset);
  } else {
    initAfterLogin(responseData.token);
  }
}

//ajax request for requesting sign up
async function signup(event) {
  event.preventDefault();

  //get form data
  const formData = new FormData(event.target);
  const userSignupData = {
    userName: formData.get("username"),
    password: formData.get("password"),
  };

  //config ajax request
  const requestUrl = `/user/signup`;
  const requestConfig = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    },
    method: "POST",
    body: JSON.stringify(userSignupData),
  };

  //show loader and disable buttons in this area
  hideAuthErrorInfo();
  const buttons = event.target.querySelectorAll("button");
  displaySignUpInFormLoader();
  disableButtons(buttons, true);

  //send ajax request
  let response;
  try {
    response = await fetch(requestUrl, requestConfig);
  } catch (error) {
    displayAuthErrorInfo(
      "Can not reach the server. Maybe check your connection?"
    );
    //hide loader and re-enable buttons
    hideOneLoader("sign-up-in-form-loader");
    disableButtons(buttons, false);
    return;
  }

  //a response was received, hide loader and re-enable buttons
  hideOneLoader("sign-up-in-form-loader");
  disableButtons(buttons, false);

  //parse response
  const responseData = await response.json();

  //response not ok
  if (!response.ok) {
    displayAuthErrorInfo(responseData.message);
    return;
  }

  //check if uer input is valid
  if (responseData.userInputNotValid) {
    displayAuthErrorInfo(responseData.message);
    return;
  }

  //check if a user with this name already exists
  if (responseData.userExistsAlready) {
    displayAuthErrorInfo(responseData.message);
    return;
  }

  //ask the user to login
  displaySignUpInForm("Login");
}
