//CSRF token
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

//invitaion info (used to check whether this pages comes from an invitation link)
let invitationInfoElement = document.querySelector('meta[name="invitation-info"]');

//create socket, for which the client does not automatically send a request
//to the server for opening it
const socketConfig = {
  autoConnect: false,
  // reconnection: false,
};
const socket = io(socketConfig);
//NOTE: by default this socket object (if no URL is pecified), will handle the connection with the server which served this page

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
addFriendButtonElement.addEventListener("click", fetchInvitationLink);
logOutButtonElement.addEventListener("click", logout);
backToChatListButton.addEventListener("click", displayFriendsAndHideChat);
chatSectionElement
  .querySelector("form")
  .addEventListener("submit", sendMessage);

//socket opened (connected)
socket.on("connect", onSocketConnect);

//ùocket closed (disconnected)
socket.on("disconnect", onSocketDisconnect);

//socket connection attempt failed
socket.on("connect_error", onSocketConnecError);

//socket boradcast event listeners
socket.on("message-receive-broadcast", onMessageReceiveBroadcast);

//global variables
let initializationDoneGlobal = false;
let chatListGlobal = [];
let lastViewedRoomIdGlobal = "";
let selectedChatItemGlobal;

//initialization
initAfterPageLoaded();
