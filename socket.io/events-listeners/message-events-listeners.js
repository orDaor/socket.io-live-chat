//imports custom
const messsageEventsController = require("../controllers/message-events-controller");

//register message events listeners
function listenToMessageEvents(io, socket) {
  //message from client contains only text + recipiend id
  socket.on("message-send", function (message, sendAck) {
    messsageEventsController.onSend(socket, message, sendAck);
  });

  socket.on("message-read", function (emptyObj, sendAck) {
    messsageEventsController.onRead(socket, emptyObj, sendAck);
  });

  socket.on("message-delete", function (messageId, sendAck) {
    messsageEventsController.onDelete(socket, messageId, sendAck);
  });
}

//exports
module.exports = listenToMessageEvents;
