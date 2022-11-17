//imports custom
const Room = require("../../models/room-model");
const Message = require("../../models/message-model");

//register the info that the user viewd a specific chat
async function registerOneChatView(socket, roomId) {
  //check if the room exists
  let room;
  try {
    room = await Room.findById(roomId);
  } catch (error) {
    return;
  }

  //check if user if present inside this room
  const userIndexInRoom = room.containsUser(socket.userId);
  if (userIndexInRoom === -1) {
    return;
  }

  //update last date view for this user
  room.setOneLastViewDate(userIndexInRoom, new Date());

  //update the room in the DB
  room.save().catch(function (error) {
    return;
  });
}

//broadcast "is typing" status to socket in a room
async function sendIsTypingStatus(io, socket, roomId) {
  //check if user is assigned to this room where he/she wants to broadcast
  if (!socket.rooms.has(roomId)) {
    return;
  }

  //all sockets in this room
  const socketList = await io.in(roomId).fetchSockets();

  //broadcast "is typing" status only to sockets not opened by this user
  for (const socketItem of socketList) {
    if (socketItem.userId !== socket.userId) {
      socketItem.emit("room-is-typing-broadcast", roomId);
    }
  }
}

//broadcast "i am alive" status coming from one user, to other users in the
//room this user is in
async function sendOnlineStatus(io, socket) {
  //target rooms this scket is in
  const roomIds = Array.from(socket.rooms); //from Set to Array

  //loop through rooms in which this user is. For each targetted
  //room, broadcast the "i am alive" status to other users
  for (const roomId of roomIds) {
    //skip room wher user is alone
    if (roomId === socket.id) {
      continue;
    }

    //all sockets in this room
    const socketList = await io.in(roomId).fetchSockets();

    //broadcast online status only to sockets not opened by this user
    for (const socketItem of socketList) {
      if (socketItem.userId !== socket.userId) {
        socketItem.emit("room-is-online-broadcast", roomId);
      }
    }
  }
}

//user requested to cancel a chat room, where he is inside together with another friend.
//This is the way the user asks for "deleting a friend"
async function cancelChat(socket, roomId, sendAck) {
  //init
  let ackData = {};

  //fetch from DB room to be deleted
  let room;
  try {
    room = await Room.findById(roomId);
  } catch (error) {
    if (error.code === 404) {
      ackData.ok = true;
      ackData.info =
        "This room does not exist, or it has already been canceled";
    } else {
      ackData.ok = false;
      ackData.info = "It is not possible to cancel this chat at the moment";
    }
    ackData.roomId = roomId;
    sendAck(ackData);
    return;
  }

  //check if user has permission to cancel this room: the user
  //MUST be active inside the chat room he wants to delete, plus
  //user should no be alone in this chat room
  const userHasPermission =
    room.containsUser(socket.userId) || room.friends.length >= 2;
  if (!userHasPermission) {
    ackData.ok = false;
    ackData.roomId = roomId;
    ackData.info = "You do not have the permission to cancel this chat";
    sendAck(ackData);
    return;
  }

  //delete chat room
  try {
    await Room.deleteById(roomId);
  } catch (error) {
    ackData.ok = false;
    ackData.roomId = roomId;
    ackData.info = "It is not possible to cancel this chat at the moment";
    sendAck(ackData);
    return;
  }

  //the user socket should now leave the deleted room
  socket.leave(roomId);

  //chat room was deleted successfully, then delete messages sent
  //in the scope of the deleted chat
  Message.deleteManyByRoomId(roomId).catch(function (error) {
    console.log(error);
  });

  //response ok
  ackData.ok = true;
  ackData.roomId = roomId;
  ackData.info = "Chat canceled successfully";
  sendAck(ackData);
}

//exports
module.exports = {
  registerOneChatView: registerOneChatView,
  sendIsTypingStatus: sendIsTypingStatus,
  sendOnlineStatus: sendOnlineStatus,
  cancelChat: cancelChat,
};
