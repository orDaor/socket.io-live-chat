const messagesCrudOps = require("../messages/messages-crud-ops");

//when a websocket connection is dropped, execute this function
function onDisconnect(reason) {
  console.log(`User disconnected because: ${reason}`);
}

//create a new message in the DB and broadcast it to all other sockets
async function onMessageCreate(socket, text, sendAck) {
  let eventAck = {};
  let result = await messagesCrudOps.create(text);
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.info = "We could not save your Message";
  } else {
    //message created successfully
    eventAck.ok = true;
    eventAck.info = "Message created successfully";
    eventAck.messageId = result.insertedId.toString();
    //broadcast the new message to all other users
    socket.broadcast.emit("message-create-broadcast", {
      text: text,
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

//update a message in the DB
async function onMessageUpdate(socket, newText, messageId, sendAck) {
  let eventAck = {};
  let result = await messagesCrudOps.update(newText, messageId);
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.info = "We could not update your message";
  } else {
    //message created successfully
    eventAck.ok = true;
    eventAck.info = "Message updated successfully";
    //broadcast the updated message to all other users
    socket.broadcast.emit("message-update-broadcast", {
      text: newText,
      messageId: messageId,
    });
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
  } else {
    //message created successfully
    eventAck.ok = true;
    eventAck.info = "Message deleted successfully";
    eventAck.id = id;
    //broadcast the new message to all other users
    socket.broadcast.emit("message-delete-broadcast", messageId);
  }

  //acknowledge the message saving request to the client
  sendAck(eventAck);
  // console.log(eventAck);
}

//exports
module.exports = {
  onDisconnect: onDisconnect,
  onMessageCreate: onMessageCreate,
  onMessageRead: onMessageRead,
  onMessageUpdate: onMessageUpdate,
  onMessageDelete: onMessageDelete,
};
