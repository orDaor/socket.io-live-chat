//imports custom
const Room = require("../../models/room-model");

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
function sendIsTypingStatus(socket, roomId) {
  //check if user is assigned to this room where he/she wants to broadcast
  if (!socket.rooms.has(roomId)) {
    return;
  }

  //broadcase "is typing" event to other suers in the room
  socket.to(roomId).emit("room-is-typing-broadcast", roomId);
}

//broadcast "i am alive" status coming from one user, to other users in the
//room this user is in
function sendOnlineStatus(socket) {
  //loop through rooms in which this user is. For each targetted
  //room, broadcast the "i am alive" status to other users
  socket.rooms.forEach(function (roomId) {
    if (roomId !== socket.id) {
      socket.to(roomId).emit("room-is-online-broadcast", roomId);
    }
  });
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
  } catch {
    ackData.ok = false;
    ackData.roomId = roomId;
    ackData.info = "It is not possible to cancel this chat at the moment";
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

  //chat room was deleted successfully
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
