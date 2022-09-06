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
const chatSectionElement = document.getElementById("chat-section");
const signUpInSectionElement = document.getElementById("sign-up-in-section");

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
