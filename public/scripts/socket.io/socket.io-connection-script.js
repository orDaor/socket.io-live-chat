//socket was opened
function onSocketConnect() {
  //socket id undefined when socket is not connected yet
  console.log(`Connected with soket.id = ${socket.id}`);
  //NOTE: "connect" means both connect and re-connect (connect after connection was closed)
  //NOTE: on "conenct" event, a new unique socket id is assigned to the socket (before connection there is no id)

  //send cyclycally "I am alive" status on the socket
  if (!iAmOnlineTimerActive) {
    setInterval(sendOnlineStatus, iAmOnlineTimerDelay);
    iAmOnlineTimerActive = true;
    //NOTE: iAmOnlineTimerActive --> prevents from starting multiple paralell "setInterval"
    //      processes when re-connecting
  }

  //notify to friend that this user just accepted an invitation
  if (lastInvitationIdAcceptedGlobal) {
    setTimeout(function () {
      notifyInvitationAcceptance(lastInvitationIdAcceptedGlobal);
      lastInvitationIdAcceptedGlobal = undefined;
    }, 1000);
  }

  //update this user online status
  setTimeout(function () {
    displayUserOnlineStatus();
    setUserOnlineStatus(true);
  }, 500);
}

//socket was closed
function onSocketDisconnect(reason) {
  //when the socket disconnects / closes its socket id is reset
  console.log(`Disconnected because: ${reason} (socket.id = ${socket.id})`);
  //NOTE: if socket is disconnected manually with socket.disconnect(), euther from client or server,
  //client will not try re-connecting automatically

  //update this user online status
  setTimeout(function () {
    setUserOnlineStatus(false);
  }, 500);
}

//socket connection attempt failed
//This can happend because of 2 REASONS:

//  1) technical reason (low level connection could not be established): for example request for connection is sent to the server but
//    server is not running; request is sent when client if offline; or ...

//      - socket.IO will try reconnection AUTOMATICALLY
//  2) websocket server refused connection (middleware sent back an error)
//      - socket.IO will NOT try reconnection automatically, but we need to MANUALLY call socket.connect()
function onSocketConnectError(error) {
  //failed because of technical reason
  if (!error.data) {
    console.log(`Connection attempt failed because: ${error.message}`);
    //will try to re-conenct automatically...
    return;
  }

  //failed because server refused connection
  console.log(
    `Connection attempt failed because: ${error.message} (${error.data.description})`
  );

  if (error.data.code === 401 || error.data.code === 403) {
    //autentication error
    displaySignUpInForm("Login"); //need to get a new valid token
    hideChatSection();
    hideFriendsSection();
  } else if (error.data.code === 500) {
    //server error
    setTimeout(function () {
      socket.connect(); //try to reconnect after 3s
    }, 3000);
  }

  //socket still closed, then user shows offline
  displayUserOnlineStatus();
  setUserOnlineStatus(false);
}
