//imports custom
const socketEventsHandlers = require("../socket-io/socket-events-handlers");

//start listening on events for a specific socket
function listenOnSocketEvents(io, socket) {
  //every time a socket is opened (connected) at server side, it will automatically
  //join a room identified by a name equal to the socket id
  console.log(`Connected with id = ${socket.id} and Rooms = { "${socket.id}" }`);

  socket.on("disconnect", function (reason) {
    socketEventsHandlers.onDisconnect(reason);
  });

  //crud operations
  socket.on("todo-create", function (todoText, sendAck) {
    socketEventsHandlers.onTodoCreate(socket, todoText, sendAck);
  });

  socket.on("todo-read", function (emptyObj, sendAck) {
    socketEventsHandlers.onTodoRead(socket, sendAck);
  });

  socket.on("todo-update", function (todo, sendAck) {
    socketEventsHandlers.onTodoUpdate(socket, todo.todoText, todo.id, sendAck);
  });

  socket.on("todo-delete", function (id, sendAck) {
    socketEventsHandlers.onTodoDelete(socket, id, sendAck);
  });
}

//exports
module.exports = listenOnSocketEvents;
