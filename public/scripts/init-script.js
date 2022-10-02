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

  //handle invitation request, in case this page was served by accessing an invitation link
  if (invitationInfo.invitationId) {
    handleInvitationRequest(
      invitationInfo.invitationId,
      invitationInfo.inviterName
    );
    return;
  }

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
        errorMessage = error.message;
        //show error info
        hideMainLoader();
        disaplayInitInfo(errorTitle, errorMessage, "Try Again");
      }
    } else {
      //technical error
      errorTitle = "Connection problems";
      errorMessage =
        "It was not possible to load your chats, because we could not reach the server. Maybe check your connection?";
      //show error info
      hideMainLoader();
      disaplayInitInfo(errorTitle, errorMessage, "Try Again");
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

  //populate friends section with chat list
  displayChatList(chatListGlobal);

  //select first chat in the friends section list
  //NOTE: with no passed parameters, 1st chat is selected by default
  selectOneChat();

  //populate chat section with messages contained in the selected chat
  displayAllMessages(chatListGlobal[0].messages);

  //show the friends and chat sections
  hideMainLoader();
  displayFriendsAndChatSectionOnWidhtChange();

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
    error = new Error();
    //401 (not authenticated), 403(not authorized), 404, 500, ...
    error.code = response.status;
    error.message = responseData.message;
    throw error;
  }

  //array of chats collected for this user
  return responseData.chatList;
}

//handle invitation request after accessing an invitation link
function handleInvitationRequest(invitationId, inviterName) {
  //check whether this page was served from an invitation link
  if (invitationId) {
    //config
    let title;
    let info;
    let action;
    //who issued this link?
    if (inviterName) {
      //the user who issued this link was found
      //...???
    } else {
      //the user who issued this link was NOT found
      title = "Ooooops...";
      info =
        "This invitation link is not valid. Please get a new link, or go back to Your Chats";
      action = "Your Chats";
      disaplayInitInfo(title, info, action);
    }
  }
}
