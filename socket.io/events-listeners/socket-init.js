//this is the first thing to be done as soon as a socket opens
function initSocket(socket) {
  //every time a socket is opened (connected) at server side, it will automatically
  //join a room identified by a name equal to the socket id
  console.log(
    `Connected with id = ${socket.id} and Rooms = { "${socket.id}" }`
  );
}

//exports
module.exports = initSocket;
