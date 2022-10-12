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
  if (!room.containsUser(socket.userId)) {
    return;
  }

  //TODO: save view in the room ??
}

//exports
module.exports = {
  registerOneChatView: registerOneChatView,
};
