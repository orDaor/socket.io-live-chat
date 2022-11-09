//imports custom
const roomEventsController = require("../controllers/room-events-controller");

//register room events listeners
function listenToRoomEvents(io, socket) {
  //register the data when a user in a room views new content
  socket.on("room-view", function (roomId) {
    roomEventsController.registerOneChatView(socket, roomId);
  });

  //broadcast "is typing status"
  socket.on("room-is-typing", function (roomId) {
    roomEventsController.sendIsTypingStatus(socket, roomId);
  });

  //broad cast "i am alive" status
  socket.on("room-is-online", function (emptyObj) {
    roomEventsController.sendOnlineStatus(socket);
  });

  //cancel a chat room
  socket.on("room-cancel", function (roomId) {
    roomEventsController.cancelChat(socket, roomId, sendAck);
  });
}

//exports
module.exports = listenToRoomEvents;
