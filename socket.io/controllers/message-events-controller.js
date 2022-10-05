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
    ackData.message = "User tried to send an empty message";
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

  // const senderId = socket.id;
  // let result = await messagesCrudOps.save(message, senderId);
  // // result = null;
  // if (!result) {
  //   //an error occured when saving in the DB
  //   ackData.ok = false;
  //   ackData.info = "We could not save your message";
  // } else {
  //   //message created successfully
  //   ackData.ok = true;
  //   ackData.info = "Message saved successfully";
  //   ackData.messageId = result.insertedId.toString();
  //   //broadcast the new message to all other users
  //   socket.broadcast.emit("message-receive-broadcast", {
  //     //how to emit to recipient???
  //     ...message, //text + recipientId
  //     senderId: senderId,
  //     messageId: ackData.messageId,
  //   });
  // }

  // //se nd acknowledge event
  // sendAck(ackData);
}

//exports
module.exports = {
  onSend: onSend,
};
