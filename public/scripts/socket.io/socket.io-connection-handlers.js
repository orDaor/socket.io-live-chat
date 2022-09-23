//socket was opened
function onSocketConnect() {
  //socket id undefined when socket is not connected yet
  console.log(`Connected with soket.id = ${socket.id}`);
  //NOTE: "connect" means both connect and re-connect (connect after connection was closed)
  //NOTE: on "conenct" event, a new unique socket id is assigned to the socket (before connection there is no id)
}

//socket was closed
function onSocketDisconnect(reason) {
  //when the socket disconnects / closes its socket id is reset
  console.log(`Disconnected because: ${reason} (socket.id = ${socket.id})`);
  //NOTE: if socket is disconnected manually with socket.disconnect(), euther from client or server,
  //client will not try re-connecting automatically
}

//socket connection attempt failed
//This can happend because of 2 reasons:
//  - technical reason (low level connection could not be established)
//      - socket.IO will try reconnection AUTOMATICALLY
//  - websocket server refused connection (middleware sent back an error)
//      - socket.IO will NOT try reconnection automatically, but we need to MANUALLY call socket.connect()
function onSocketConnecError(error) {
  console.log(`Socket connection attempt failed`);
}
