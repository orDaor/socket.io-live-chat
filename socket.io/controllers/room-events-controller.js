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

//exports
module.exports = {
  registerOneChatView: registerOneChatView,
};
