//imports custom
const Room = require("../../models/room-model");

//save the info that the user viewd a specific chat
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

  // console.log(
  //   `Save view for user ${room.friends[userIndexInRoom]} in room ${room.roomId}`
  // );

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

//exports
module.exports = {
  registerOneChatView: registerOneChatView,
  sendIsTypingStatus: sendIsTypingStatus,
};
