//imports custom
const socketEventsHandlers = require("../socket.io/socket-events-handlers");

//start listening on events for a specific socket
function listenOnSocketEvents(io, socket) {
  //every time a socket is opened (connected) at server side, it will automatically
  //join a room identified by a name equal to the socket id
  console.log(
    `Connected with id = ${socket.id} and Rooms = { "${socket.id}" }`
  );

  socket.on("disconnect", function (reason) {
    socketEventsHandlers.onDisconnect(reason);
  });

  //crud operations
  socket.on("message-create", function (text, sendAck) {
    socketEventsHandlers.onMessageCreate(socket, text, sendAck);
  });

  socket.on("message-read", function (emptyObj, sendAck) {
    socketEventsHandlers.onMessageRead(socket, sendAck);
  });

  socket.on("message-update", function (message, sendAck) {
    socketEventsHandlers.onMessageUpdate(
      socket,
      message.text,
      message.messageId,
      sendAck
    );
  });

  socket.on("message-delete", function (messageId, sendAck) {
    socketEventsHandlers.onMessageDelete(socket, messageId, sendAck);
  });
}

//exports
module.exports = listenOnSocketEvents;
