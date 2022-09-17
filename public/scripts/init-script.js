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
  hideFriendsSection();
  hideChatSection();
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
  const chats = await fetchChats(token);

  //loading stopped
  hideMainLoader();

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

  //initialization done
  console.log("hey");
  initializationDoneGlobal = true;
}

//fetch "all" user messages
async function fetchChats(token) {
  let chats = [];

  console.log("Chats loaded");

  return chats;
}
