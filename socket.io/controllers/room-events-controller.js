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

//exports
module.exports = {
  registerOneChatView: registerOneChatView,
  sendIsTypingStatus: sendIsTypingStatus,
  sendOnlineStatus: sendOnlineStatus,
};
