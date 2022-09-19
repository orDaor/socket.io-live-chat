//CSRF token
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

//create socket, for which the client does not automatically send a request
//to the server for opening it
const socketConfig = {
  autoConnect: false,
  // reconnection: false,
};
const socket = io(socketConfig);

//access DOM elements
const initInfoSectionElement = document.getElementById("init-info-section");
const signUpInSectionElement = document.getElementById("sign-up-in-section");
const friendsSectionElement = document.getElementById("friends-section");
const addFriendButtonElement = document.querySelector(
  ".friends-control .add-friend-btn"
);
const logOutButtonElement = document.querySelector(
  ".friends-control .log-out-btn"
);
const chatSectionElement = document.getElementById("chat-section");
const backToChatListButton = document.querySelector(
  ".active-friends .back-to-chat-list"
);

//standard event listeners
window.addEventListener("resize", displayFriendsAndChatSectionOnWidhtChange);
addFriendButtonElement.addEventListener("click", getInvitationLink);
logOutButtonElement.addEventListener("click", logout);
backToChatListButton.addEventListener("click", displayFriendsAndHideChat);
chatSectionElement
  .querySelector("form")
  .addEventListener("submit", sendMessage);

//on socket opened (connected)
socket.on("connect", function () {
  //socket id undefined when socket is not connected yet
  console.log(`Connected with id = ${socket.id}`);
});
//NOTE: "connect" means both connect and re-connect (connect after connection was closed)
//NOTE: on "conenct" event, a new unique socket id is assigned to the socket (before connection there is no id)

//on socket closed (disconnected)
socket.on("disconnect", function (reason) {
  //when the socket disconnects / closes its socket id is reset
  console.log(`Disconnected because: ${reason} (id = ${socket.id})`);
});
//NOTE: if socket is disconnected manually with socket.disconnect(), euther from client or server,
//      client will not try re-connecting automatically

//socket boradcast event listeners
socket.on("message-receive-broadcast", onMessageReceiveBroadcast);
socket.on("message-delete-broadcast", onMessageDeleteBroadcast);

//socket ack event listeners
//...??


//global variables
let initializationDoneGlobal = false;

//initialization
initAfterPageLoaded();

