//CSRF token
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

//invitaion info (used to check whether this pages comes from an invitation link)
let invitationInfoElement = document.querySelector(
  'meta[name="invitation-info"]'
);

//create socket, for which the client does not automatically send a request
//to the server for opening it
const socketConfig = {
  autoConnect: false,
  // reconnection: false,
};
const socket = io(socketConfig);
//NOTE: by default this socket object (if no URL is pecified), will handle the connection with the server which served this page

//access DOM elements
const modalSectionElement = document.getElementById("modal-section");
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
  .querySelector(".active-friends")
  .addEventListener("click", hideChatActions);
chatSectionElement
  .querySelector(".active-friends .chat-action")
  .addEventListener("click", displayChatActions);
chatSectionElement
  .querySelector("form")
  .addEventListener("submit", sendMessage);
chatSectionElement
  .querySelector(".chat-actions textarea")
  .addEventListener("input", sendIsTypingStatus);
chatSectionElement
  .querySelector("ul")
  .addEventListener("click", hideAllMessagesActions);
chatSectionElement
  .querySelector("ul")
  .addEventListener("scroll", onMessagesListScroll);

//socket opened (connected)
socket.on("connect", onSocketConnect);

//ùocket closed (disconnected)
socket.on("disconnect", onSocketDisconnect);

//socket connection attempt failed
socket.on("connect_error", onSocketConnectError);

//socket boradcast event listeners
socket.on("message-receive-broadcast", onMessageReceiveBroadcast);
socket.on("room-is-typing-broadcast", onRoomIsTypingBroadcast);
socket.on("room-is-online-broadcast", onRoomIsOnlineBroadcast);
socket.on("message-delete-broadcast", onMessageDeleteBroadcast);
socket.on(
  "user-accecpted-invitation-broadcast",
  onUserAcceptedInvitationBroadcast
);

//global variables
let initializationDoneGlobal = false;
let chatListGlobal = [];
let selectedChatItemGlobal;
let selectedMessageItemGlobal;
let lastGeneratedInvitationLinkGlobal = "";
let lastInvitationIdAcceptedGlobal;

//timer: send "is typing" info
let isTypingTimerId_send;
let isTypingTimerActive_send = false;
let isTypingTimerDelay_send = 1500;

//timer: display "is typing info" in the selected chat
let isTypingTimerId_receive;
let isTypingTimerActive_receive = false;
let isTypingTimerDelay_receive = 3000;

//timer: send "i am online" info to users in the rooms I am in
let iAmOnlineTimerDelay = 1500;
let iAmOnlineTimerActive = false;

//timer: "friend is online timer delay"
let friendIsOnlineTimerDelay = 3000;

//block displaying of scroll to bottom arrow in messages list
let disableDisplayOfScrollToBottomButton = false;

//when this is set, it is not possible to request the server to load more
//messages for the selected chat
let disableLoadingOfMoreMessages = false;

//disable other chats selection
let disableAnyChatSelection = false;

//initialization
initAfterPageLoaded();
