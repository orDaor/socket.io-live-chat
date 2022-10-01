//request a link for inviting a friend
function fetchInvitationLink() {
  //init
  hideInvitationLink();
  hideFriendsControlErrorInfo();
  const errorInfo =
    "It is not possible to reach the server now... Maybe check your connection?";
  const delay = 5000;

  //socket not connected
  if (!socket.connected) {
    displayFriendsControlErrorInfo(errorInfo);
    return;
  }

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    displayFriendsControlErrorInfo(errorInfo);
  }, delay);

  //send event
  socket.emit("user-fetch-invitation-link", {}, function (ackData) {
    clearTimeout(timerId);
    onUserFetchInvitationLinkAck(ackData);
  });
}

//emit a message on the websocket connection
function sendMessage(event) {
  event.preventDefault();
  ////user not connected...
  if (!socket.connected) {
    displayMainErrorInfo("You are not connected!");
    return;
  }

  //user connected...
  const formData = new FormData(event.target);
  const activeChatElement = chatSectionElement.querySelector(".active-friends");

  //build message
  const message = {
    text: formData.get("message"),
    recipientId: activeChatElement.dataset.roomId,
  };

  //send message
  if (message.text.trim()) {
    hideMainErrorInfo();
    displayOneMessage(
      false,
      "id-not-confirmed",
      message.text,
      new Date(), //now
      "right",
      true
    );
    //send (emit) a event with a message to the server
    socket.emit("message-send", message, onMessageSendAck); //we can pass any data that can be encoded as JSON
    formData.set("message", "");
  }
}

//read all messages: emit an emty event asking the server to send back an array of the messages
function readMessage() {
  //user not connected...
  if (!socket.connected) {
    displayMainErrorInfo("You are not connected!");
    return;
  }

  ////user connected...
  socket.emit("message-read", {}, onMessageReadAck);
}

//delete a message: emit event containing id of th message to delete
function deleteMessage(event) {
  //user not connected...
  event.preventDefault();
  if (!socket.connected) {
    displayMainErrorInfo("You are not connected!");
    return;
  }

  //user connected...
  const updateButtonElement = event.target;
  const messageId = updateButtonElement.parent.dataset.messageId; // to be checked!!
  socket.emit("message-delete", messageId, onMessageDeleteAck);
}
