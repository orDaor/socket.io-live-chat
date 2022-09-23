function logSocketInitInfo(socket) {
  //NOTE: every time a socket is opened (connected) at server side, it will automatically
  //join a room identified by a name equal to the socket id
  console.log(
    `Connected with:
        - socket.id = ${socket.id}
        - socket.userId = ${socket.userId}
        - `
  );

  //rooms
  console.log("rooms: ", socket.rooms);
}

//exports
module.exports = {
    logSocketInitInfo: logSocketInitInfo,
};
