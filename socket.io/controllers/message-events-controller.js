//imports custom
const Message = require("../../models/message-model");
const MessageViewData = require("../../models/message-view-data-model");
const Room = require("../../models/room-model");
const User = require("../../models/user-model");
const validation = require("../../utils/validation-util");

//send a message
async function onSend(socket, message, sendAck) {
  //init ack
  let ackData = {};

  //message not valid, can not be sent
  const validatedMessage = validation.message(message, false);
  if (!validatedMessage) {
    ackData.ok = false;
    ackData.info = "User tried to send a non valid message";
    ackData.tempMessageId = message.tempMessageId;
    sendAck(ackData);
    return;
  }

  //the message contains a destination room id --> check if this socket
  //is assigned to such a room. If not send back an error
  if (!socket.rooms.has(validatedMessage.validatedRoomId)) {
    ackData.ok = false;
    ackData.info = "Message can not be sento to this room (1)";
    sendAck(ackData);
    return;
  }

  //check if the destination room exists in the DB
  let room;
  try {
    room = await Room.findById(validatedMessage.validatedRoomId);
  } catch (error) {
    ackData.ok = false;
    ackData.info = "Message can not be sento to this room (2)";
    sendAck(ackData);
    return;
  }

  //gather message data
  const fullMessage = new Message(
    validatedMessage.validatedText,
    validatedMessage.validatedRoomId, //recipient
    socket.userId //sender
    //creation date = now
  );

  //save message in the DB
  let messageId;
  try {
    messageId = await fullMessage.save();
  } catch (error) {
    ackData.ok = false;
    ackData.info = "Message not saved";
    sendAck(ackData);
    return;
  }

  //update message id
  fullMessage.messageId = messageId;

  //find user names in the destination room
  let friends;
  let friendsNames = [];
  let errorList = [];
  try {
    friends = await User.findManyByIds(room.friends);
    friendsNames = friends.map(function (friend) {
      return friend.name;
    });
  } catch (error) {
    errorList.push(1001);
  }

  //find the message sender name
  let senderName = "";
  const friendIndex = friends.findIndex(function (user) {
    return user.userId === socket.userId;
  });
  if (friendIndex > -1) {
    senderName = friends[friendIndex].name;
  }

  //build the broadcast message
  const broadcastData = {
    message: new MessageViewData(fullMessage, null),
    roomId: fullMessage.roomId,
    senderName: senderName,
    friendsNames: friendsNames,
    errorList: errorList,
  };

  //broadcast message to the destination room from this socket
  socket
    .to(fullMessage.roomId)
    .emit("message-receive-broadcast", broadcastData);

  //send ack ok
  ackData.ok = true;
  ackData.info = "Message sent successfully";
  ackData.roomId = fullMessage.roomId;
  ackData.tempMessageId = validatedMessage.validatedTempMessageId;
  ackData.message = new MessageViewData(fullMessage, socket.userId);
  sendAck(ackData);
}

//exports
module.exports = {
  onSend: onSend,
};
