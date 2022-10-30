//imports custom
const messsageEventsController = require("../controllers/message-events-controller");

//register message events listeners
function listenToMessageEvents(io, socket) {
  //send message
  socket.on("message-send", function (message, sendAck) {
    messsageEventsController.onSend(socket, message, sendAck);
  });

  //delete message
  socket.on("message-delete", function (messageId, sendAck) {
    messsageEventsController.onDelete(socket, messageId, sendAck);
  });
}

//exports
module.exports = listenToMessageEvents;
