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
  let chatList;
  let errorTitle;
  let errorMessage;
  try {
    chatList = await fetchChatList(token);
  } catch (error) {
    if (error.code) {
      //not authenticated or not authorized (token validation at server side failed)
      if (error.code === 401 || error.code === 403) {
        //loading stopped
        hideMainLoader();
        displaySignUpInForm("Login"); //need to get a new valid token
      } else {
        //bad response
        errorTitle = "Ooooops...";
        errorMessage = error.customMessage;
        //show error info
        hideMainLoader();
        disaplayInitInfo(errorTitle, errorMessage);
      }
    } else {
      //technical error
      errorTitle = "Connection problems";
      errorMessage =
        "It was not possible to load your chats, because we could not reach the server. Maybe check your connection?";
      //show error info
      hideMainLoader();
      disaplayInitInfo(errorTitle, errorMessage);
    }
    return;
  }

  //memorize chat list in global variable
  chatListGlobal = chatList;

  //no chats found
  if (chatListGlobal.length === 0) {
    hideMainLoader();
    displayFriendsSection();
    //upgrade connection to websocket protocol
    socket.connect();
    initializationDoneGlobal = true;
    return;
  }

  //some chats were found...
  displayFriendsAndChatSectionOnWidhtChange();

  //populate friends section with chat list
  displayChatList(chatListGlobal);

  //select first chat in the friends section list
  //NOTE: with no passed parameters, 1st chat is selected by default
  selectOneChat();

  //populate chat section with messages contained in the selected chat
  displayAllMessages(chatListGlobal[0].messages);

  hideMainLoader();

  //upgrade connection to websocket protocol
  socket.connect();

  //initialization done
  initializationDoneGlobal = true;
}

//fetch "all" user messages
async function fetchChatList(token) {
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
  return responseData.chatList;
}
