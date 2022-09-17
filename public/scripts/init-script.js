//initialization after page finished to laod
function initAfterPageLoaded() {
  //check if a JWT is already store for this website
  const token = localStorage.getItem("token");

  //a token was found
  if (token) {
    initAfterLogin(token);
    return;
  }

  //no token is stored, then need to login to get a valid token
  displaySignUpInForm("Login");
}

//initialization after successfull login
async function initAfterLogin(token) {
  //attach token to socket
  socket.auth = { token: token };

  //loading...
  hideSignUpInForm();
  displayMainLoader();

  //fetch messages for this user
  let chats;
  let errorTitle;
  let errorMessage;
  try {
    chats = await fetchChats(token);
  } catch (error) {
    if (error.code) {
      //bad response
      errorTitle = "Ooooops...";
      errorMessage = error.customMessage;
    } else {
      //technical error
      errorTitle = "Connection problems";
      errorMessage =
        "It was not possible to load your chats, because we could not reach the server. Maybe check your connection?";
    }
    //loading stopped
    hideMainLoader();
    disaplayInitInfo(errorTitle, errorMessage);
    return;
  }

  //no chats found
  if (chats.length === 0) {
    displayFriendsSection();
    initializationDoneGlobal = true;
    return;
  }

  //some chats were found...
  displayFriendsAndChatSectionOnWidhtChange();

  //load chats on screen
  //...??

  //loading stopped
  hideMainLoader();

  //initialization done
  initializationDoneGlobal = true;
}

//fetch "all" user messages
async function fetchChats(token) {
  let response;
  let error;

  //config ajax request
  const requestUrl = `/message/all`;
  const requestConfig = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    },
    method: "POST",
    body: JSON.stringify({ token: token }),
  };

  //send ajax request
  response = await fetch(requestUrl, requestConfig);

  //parse response
  const responseData = await response.json();

  //response not ok
  if (!response.ok) {
    error = new Error("Response not ok");
    //401 (not authenticated), 403(not authorized), 404, 500, ...
    error.code = response.status;
    error.customMessage = responseData.message;
    throw error;
  }

  //array of chats collected for this user
  return responseData.chats;
}
