//when a websocket connection is dropped, execute this function
function onDisconnect(reason) {
  console.log(`User disconnected because: ${reason}`);
}

//create a new message in the DB and broadcast it to all other sockets
async function onMessageSend(socket, message, sendAck) {
  let eventAck = {};
  const senderId = socket.id;
  let result = await messagesCrudOps.save(message, senderId);
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.info = "We could not save your message";
  } else {
    //message created successfully
    eventAck.ok = true;
    eventAck.info = "Message saved successfully";
    eventAck.messageId = result.insertedId.toString();
    //broadcast the new message to all other users
    socket.broadcast.emit("message-receive-broadcast", {
      //how to emit to recipient???
      ...message, //text + recipientId
      senderId: senderId,
      messageId: eventAck.messageId,
    });
  }

  //acknowledge the message saving request to the client
  sendAck(eventAck);
  // console.log(eventAck);
}

//read messages from DB
async function onMessageRead(socket, sendAck) {
  let eventAck = {};
  let result = await messagesCrudOps.read();
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.info = "We could not get your messages";
  } else {
    //message created successfully
    eventAck.ok = true;
    eventAck.info = "Messages fetched successfully";
    eventAck.messages = result;
  }

  //acknowledge the message saving request to the client
  sendAck(eventAck);
  // console.log(eventAck);
}

//delete a message from the DB
async function onMessageDelete(socket, messageId, sendAck) {
  let eventAck = {};
  let result = await messagesCrudOps.remove(messageId);
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.info = "We could not delete your message";
    eventAck.messageId = messageId;
  } else {
    //message created successfully
    eventAck.ok = true;
    eventAck.info = "Message deleted successfully";
    eventAck.messageId = messageId;
    //broadcast the new message to all other users
    //how to emit to recipient???
    socket.broadcast.emit("message-delete-broadcast", messageId);
  }

  //acknowledge the message saving request to the client
  sendAck(eventAck);
  // console.log(eventAck);
}

//exports
module.exports = {
  onDisconnect: onDisconnect,
  onMessageSend: onMessageSend,
  onMessageRead: onMessageRead,
  onMessageDelete: onMessageDelete,
};
