//imports custom
const messsageEventsController = require("../controllers/message-events-controller");

//register message events listeners
function listenToMessageEvents(io, socket) {
  //message from client 
  socket.on("message-send", function (message, sendAck) {
    messsageEventsController.onSend(socket, message, sendAck);
  });
}

//exports
module.exports = listenToMessageEvents;
