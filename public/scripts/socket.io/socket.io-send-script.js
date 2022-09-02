//emit a message on the websocket connection
function createMessage(event) {
  ////user not connected...
  event.preventDefault();
  if (!socket.connected) {
    displayErrorInfo("You are not connected!");
    return;
  }

  //user connected...
  const text = formInputElement.value;
  if (text.trim()) {
    hideErrorInfo();
    displayOneMessage(text, "not-confirmed");
    //send (emit) a event with a message to the server
    socket.emit("message-create", text, onMessageCreateAck); //we can pass any data that can be encoded as JSON
    formInputElement.value = "";
  }
}

//read all messages: emit an emty event asking the server to send back an array of the messages
function readMessage() {
  //user not connected...
  if (!socket.connected) {
    displayErrorInfo("You are not connected!");
    return;
  }

  ////user connected...
  socket.emit("message-read", {}, onMessageReadAck);
}

//update a message: emit a an event containing the message id with the new text
function updateMessage(event) {
  //user not connected...
  if (!socket.connected) {
    displayErrorInfo("You are not connected!");
    return;
  }

  //user connected...
  const updateButtonElement = event.target;
  const messageId = updateButtonElement.dataset.messageId; // to be checked!!
  const thisListItemElement = updateButtonElement.parentElement.parentElement; // to be checked!!
  const inputValue = thisListItemElement.querySelector("input").value;
  socket.emit(
    "message-update",
    { text: inputValue, messageId: messageId },
    onMessageUpdateAck
  );
}

//delete a message: emit event containing id of th message to delete
function deleteMessage(event) {
  //user not connected...
  event.preventDefault();
  if (!socket.connected) {
    displayErrorInfo("You are not connected!");
    return;
  }

  //user connected...
  const updateButtonElement = event.target;
  const messageId = updateButtonElement.dataset.messageId; // to be checked!!
  socket.emit("message-delete", messageId, onMessageDeleteAck);
}
