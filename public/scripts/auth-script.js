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
  const requestUrl = `/login`;
  const requestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    boddy: JSON.stringify(userLoginData),
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

  //login was ok
  hideSignUpInForm();
  displayFriendsSection();
  displayChatSection();
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

  //config ajax request for log in
  const requestUrl = `/signup`;
  const requestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    boddy: JSON.stringify(userSignupData),
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

  //login was ok

  //save JWT...

  hideSignUpInForm();
  displaySignUpInForm("Login");
}
