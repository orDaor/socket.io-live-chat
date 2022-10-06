//imports custom
const Message = require("../../models/message-model");
const validation = require("../../utils/validation-util");

//send a message
async function onSend(socket, message, sendAck) {
  //init ack
  let ackData = {};

  //message not valid, can not be sent
  console.log(message);
  const validatedMessage = validation.message(message);
  if (!validatedMessage) {
    ackData.ok = false;
    ackData.message = "User tried to send a non valid message";
    sendAck(ackData);
    return;
  }

  //gather message data
  const fullMessage = new Message(
    validatedMessage.validatedText,
    validatedMessage.validatedRoomId, //recipient
    socket.userId, //sender
    validatedMessage.validatedCreationDate
  );

  console.log(fullMessage);

  //the message contains a destination room id --> check if this socket
  //is assigned to such a room. If not send back an error
  if (!socket.rooms.has(validatedMessage.validatedRoomId)) {
    ackData.ok = false;
    ackData.message = "Message can not be sento to this room";
    sendAck(ackData);
    return;
  }

  //save message in the DB
  let messageId;
  try {
    messageId = await fullMessage.save();
  } catch (error) {
    ackData.ok = false;
    ackData.message = "Message not saved";
    sendAck(ackData);
    return;
  }

  //broadcast message to the destination room from this socket
  const broadCastData = {
    text: validatedMessage.validatedText,
    creationDate: validatedMessage.validatedCreationDate,
  };
  socket
    .to(validatedMessage.validatedRoomId)
    .emit("message-receive-broadcast", broadCastData);

  //send ack ok
  ackData.ok = true;
  ackData.messageId = messageId;
  ackData.tempMessageId = validatedMessage.validatedTempMessageId;
}

//exports
module.exports = {
  onSend: onSend,
};
