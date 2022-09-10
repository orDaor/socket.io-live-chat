//CSRF token
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

//create socket, for which the client does not automatically send a request
//to the server for opening it
const socketConfig = {
  autoConnect: false,
};
const socket = io(socketConfig);

//access DOM elements
const friendsSectionElement = document.getElementById("friends-section");
const addFriendButtonElement = document.querySelector(".friends-control .add-friend-btn");
const logOutButtonElement = document.querySelector(".friends-control .log-out-btn");
const chatSectionElement = document.getElementById("chat-section");
const signUpInSectionElement = document.getElementById("sign-up-in-section");
const backToFriendsPageButton = document.querySelector(".active-friends .back-to-friends-page");

//standard event listeners
window.addEventListener("resize", displayFriendsAndChatSectionOnWidhtChaange);
addFriendButtonElement.addEventListener("click", getInvitationLink);
logOutButtonElement.addEventListener("click", logout);
backToFriendsPageButton.addEventListener("click", displayFriendsAndHideChat);

//send events to server
chatSectionElement
  .querySelector("form")
  .addEventListener("submit", sendMessage);

//on socket opening / connection on
socket.on("connect", function () {
  console.log(`Connected with id = ${socket.id}`); //socket undefined when not connected yet
  readMessage();
});
//NOTE: "connect" means both connect and re-connect (connect after connection was closed)
//NOTE: at "conenct" event a new unique socket id is assigned to a socket (before connection there is no id)

//on socket closed / disconnected
socket.on("disconnect", function (reason) {
  //when the socket disconnects / closes its socket id is reset
  console.log(`Disconnected because: ${reason} (id = ${socket.id})`);
});
//NOTE: if we disconnect manually (from client or server), reconnection will not be automatic by the client

//listen from broadcast events from server
socket.on("message-receive-broadcast", onMessageReceiveBroadcast);
socket.on("message-delete-broadcast", onMessageDeleteBroadcast);

//global variables
let thisUserId;
