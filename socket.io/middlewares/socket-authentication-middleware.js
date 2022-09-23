//imports 3rd party
const jwt = require("jsonwebtoken");

//imports custom
const Room = require("../../models/room-model");

//this function checks whether a user is allowed or not to open a socket connection.
//User is allowed if it is authenticated
async function socketAuthCheckMiddleware(socket, next) {
  //check if request carries a token
  const token = socket.handshake.auth.token;
  //init error
  let error;

  //no token in the request, move to next middleware/route
  if (!token) {
    //refuse socket connection
    error = new Error("User not authenticated");
    error.code = 401;
    error.customMessage = "User not authenticated";
    next(error);
    return;
  }

  //a token is found in the request,
  //check if user is authenticated (move this to the authentication middleware).
  //NOTE: no callback is passed to verify(), therefor it is called in SYNC way
  //NOTE: SYNC call is needed, because Sociot.IO middleware can not terminate without calling next() ! ! !
  let jwtPayload;
  try {
    jwtPayload = jwt.verify(token, "not-a-secret", { algorithms: ["HS256"] });
  } catch (error) {
    //refuse socket connection
    error.customMessage = "User not authenticated";
    error.code = 401;
    next(error);
    return;
  }

  //save in the socket which is about to be opened the user who requested to open this socket
  socket.userId = jwtPayload.userId;

  //find rooms in which this user is active
  let rooms;
  try {
    rooms = await Room.findManyByUserId(socket.userId);
  } catch (error) {
    //refuse socket connection
    error.customMessage =
      "Could not fetch rooms info of the user from the database";
    error.code = 500;
    next(error);
    return;
  }

  //save in the socket an array of the room ids
  const mapOneRoom = function (room) {
    return room.id;
  };
  socket.dbRooms = rooms.map(mapOneRoom);

  //response ok
  next();
}

//exports
module.exports = socketAuthCheckMiddleware;
