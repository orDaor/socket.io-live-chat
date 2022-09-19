//log out
function logout(event) {
  //remove JWT
  localStorage.removeItem("token");

  //clean all chat content
  cleanChatList();
  cleanAllMessages();

  //use must login again to get a new token
  hideFriendsSection();
  hideChatSection();
  displaySignUpInForm("Login");

  //restart
  initializationDoneGlobal = false;
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

  //send ajax request for login
  let response;
  try {
    response = await fetch(requestUrl, requestConfig);
  } catch (error) {
    displayAuthErrorInfo(
      "Can not reach the server. May check your connection?"
    );
    return;
  }

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

  //login was ok, get and memorize JWT
  localStorage.setItem("token", responseData.token);

  //initialize after login
  initAfterLogin(responseData.token);
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

  //send ajax request
  let response;
  try {
    response = await fetch(requestUrl, requestConfig);
  } catch (error) {
    displayAuthErrorInfo(
      "Can not reach the server. Maybe check your connection?"
    );
    return;
  }

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
