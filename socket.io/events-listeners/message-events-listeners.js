//imports custom
const messsageEventsController = require("../controllers/message-events-controller");

//register message events listeners
function listenToMessageEvents(io, socket) {
  //send message
  socket.on("message-send", function (message, sendAck) {
    messsageEventsController.onSend(io, socket, message, sendAck);
  });

  //delete message
  socket.on("message-delete", function (messageId, sendAck) {
    messsageEventsController.onDelete(io, socket, messageId, sendAck);
  });

  //load more messages
  socket.on("message-load", function (eldestMessageData, sendAck) {
    messsageEventsController.onMessageLoad(socket, eldestMessageData, sendAck);
  });
}

//exports
module.exports = listenToMessageEvents;
