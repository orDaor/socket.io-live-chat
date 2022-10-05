//imports custom
const logging = require("../../utils/logging");

//this is the first thing to be done as soon as a socket opens
function initSocket(socket) {
  console.log(socket.dbRooms);
  //check if user is supposed to join any room
  if (socket.dbRooms.length !== 0) {
    socket.join(socket.dbRooms);
  }

  //NOTE: every time a socket is opened (connected) at server side, it will automatically
  //join a room identified by a name equal to the socket id
  logging.logSocketInitInfo(socket);
}

//exports
module.exports = initSocket;
