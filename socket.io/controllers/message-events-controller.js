//send a message
async function onSend(socket, message, sendAck) {
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

//read messages
async function onRead(socket, emptyObj, sendAck) {
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

//delete a message
async function onDelete(socket, messageId, sendAck) {
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
  onSend: onSend,
  onRead: onRead,
  onDelete: onDelete,
};
