//imports custom
const roomEventsController = require("../controllers/room-events-controller");

//register room events listeners
function listenToRoomEvents(io, socket) {
  socket.on("room-view", function (roomId) {
    roomEventsController.registerOneChatView(socket, roomId);
  });
}

//exports
module.exports = listenToRoomEvents;
