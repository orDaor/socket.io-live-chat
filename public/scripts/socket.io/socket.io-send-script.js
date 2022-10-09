//request a link for inviting a friend
function fetchInvitationLink() {
  //init
  hideInvitationLink();
  hideFriendsControlErrorInfo();
  const errorInfo = "An error occured";
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
  const errorInfo = "An error occured";
  const delay = 5000;

  //user connected...
  const formData = new FormData(event.target);
  const activeChatElement = chatSectionElement.querySelector(".active-friends");

  //build message
  const tempMessageId = new Date().getTime().toString();
  const message = {
    text: formData.get("message").trim(),
    roomId: activeChatElement.dataset.roomId,
    creationDate: new Date(), //now
    tempMessageId: tempMessageId,
  };

  //if no input content, do nothing
  if (!message.text) {
    return;
  }

  //display message right when sending it
  displayOneMessage(
    false,
    message.tempMessageId,
    message.text,
    new Date(), //now
    "right",
    true,
    "smooth"
  );

  //user not connected...
  if (!socket.connected) {
    displayOneMessageErrorInfo(message.tempMessageId, errorInfo);
    return;
  }

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    hideOneMessageErrorInfo(message.tempMessageId);
    displayOneMessageErrorInfo(message.tempMessageId, errorInfo);
  }, delay);

  //send (emit) a event with a message to the server
  socket.emit("message-send", message, function (ackData) {
    clearTimeout(timerId);
    onMessageSendAck(ackData);
  }); //we can pass any data that can be encoded as JSON

  //clean form input
  event.target.querySelector("textarea[name='message']").value = "";
}
