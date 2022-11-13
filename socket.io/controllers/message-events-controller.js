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
    ackData.info = "The message is not valid for sending";
    ackData.roomId = message.roomId;
    ackData.tempMessageId = message.tempMessageId;
    sendAck(ackData);
    return;
  }

  //the message contains a destination room id --> check if this socket
  //is assigned to such a room. If not send back an error
  if (!socket.rooms.has(validatedMessage.validatedRoomId)) {
    ackData.ok = false;
    ackData.info = "The message can not be sento to the recipient (1)";
    ackData.roomId = validatedMessage.validatedRoomId;
    ackData.tempMessageId = validatedMessage.validatedTempMessageId;
    sendAck(ackData);
    return;
  }

  //check if the destination room exists in the DB
  let room;
  try {
    room = await Room.findById(validatedMessage.validatedRoomId);
  } catch (error) {
    ackData.ok = false;
    ackData.info = "The message can not be sento to the recipient (2)";
    ackData.roomId = validatedMessage.validatedRoomId;
    ackData.tempMessageId = validatedMessage.validatedTempMessageId;
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
    ackData.info = "The message can not be sent at the moment";
    ackData.roomId = validatedMessage.validatedRoomId;
    ackData.tempMessageId = validatedMessage.validatedTempMessageId;
    sendAck(ackData);
    return;
  }

  //update message id
  fullMessage.messageId = messageId;

  //update last activity date of the destination chat room
  room.lastActivityDate = fullMessage.creationDate;
  room.save().catch(function (error) {
    //??
  });

  //find user names in the destination room
  let friends = [];
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
    roomId: validatedMessage.validatedRoomId,
    senderName: senderName,
    friendsNames: friendsNames,
    errorList: errorList,
  };

  //broadcast message to the destination room from this socket
  socket
    .to(validatedMessage.validatedRoomId)
    .emit("message-receive-broadcast", broadcastData);

  //send ack ok
  ackData.ok = true;
  ackData.info = "Message sent successfully";
  ackData.roomId = validatedMessage.validatedRoomId;
  ackData.tempMessageId = validatedMessage.validatedTempMessageId;
  ackData.message = new MessageViewData(fullMessage, socket.userId);
  sendAck(ackData);
}

//delete a message
async function onDelete(socket, messageId, sendAck) {
  //init ack
  let ackData = {};

  //check if message to delete exists
  let message;
  try {
    message = await Message.findById(messageId);
  } catch (error) {
    ackData.ok = false;
    ackData.info = "This message does not exist";
    ackData.messageId = messageId;
    sendAck(ackData);
    return;
  }

  //check if the user who want to delete this message is
  //the actual sender of this message
  if (socket.userId !== message.senderId) {
    ackData.ok = false;
    ackData.info = "You do not have the permission to delete this message";
    ackData.messageId = messageId;
    sendAck(ackData);
    return;
  }

  //delete the message
  try {
    await Message.deleteById(messageId);
  } catch (error) {
    ackData.ok = false;
    ackData.info = "It is not possible to delete this message at the moment";
    ackData.messageId = messageId;
    sendAck(ackData);
    return;
  }

  //broadcast message delete event to users in the room this message was sent,
  //the message will disappear on those users screen
  const broadcastData = {
    messageId: messageId,
    roomId: message.roomId,
  };
  socket.to(message.roomId).emit("message-delete-broadcast", broadcastData);

  //response ok
  ackData.ok = true;
  ackData.info = "Message deleted successfully";
  ackData.messageId = messageId;
  ackData.roomId = message.roomId;
  sendAck(ackData);
}

//load more messages
async function onMessageLoad(socket, eldestMessageData, sendAck) {
  //request data
  const roomId = eldestMessageData.roomId; //chat room for which user is requesting more messages
  const eldestMessageId = eldestMessageData.messageId;
  let eldestMessageCreationDate;
  if (eldestMessageData.creationDate) {
    eldestMessageCreationDate = new Date(eldestMessageData.creationDate);
  } else {
    eldestMessageCreationDate = "";
  }

  await new Promise(r => setTimeout(r, 6000)); // ---------->> DELETE ! ! ! 

  //init ack
  let ackData = {};

  //find "more" messages sent into this room context
  let messages;
  try {
    if (!eldestMessageId && !eldestMessageCreationDate) {
      messages = await Message.findManyByRoomId(roomId);
    } else {
      messages = await Message.findMore(
        roomId,
        eldestMessageId,
        eldestMessageCreationDate
      );
    }
  } catch (error) {
    ackData.ok = false;
    ackData.info = "It is not possible fetch more messages at the moment";
    sendAck(ackData);
    return;
  }

  //map each messages in MessageViewData class objects
  const viewerId = socket.userId;
  const mapOneMessage = function (message) {
    return new MessageViewData(message, viewerId);
  };
  //from most recent to oldest
  const mappedMessages = messages.map(mapOneMessage);

  //no more messages found
  if (!mappedMessages.length) {
    ackData.ok = false;
    ackData.roomId = roomId;
    ackData.info = "There aro no more messages to be fetched";
    sendAck(ackData);
    return;
  }

  //respones ok
  ackData.ok = true;
  ackData.roomId = roomId;
  ackData.moreMessages = mappedMessages;
  sendAck(ackData);
}

//exports
module.exports = {
  onSend: onSend,
  onDelete: onDelete,
  onMessageLoad: onMessageLoad,
};
