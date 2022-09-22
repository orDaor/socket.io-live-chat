//imports 3rd party
const jwt = require("jsonwebtoken");

//this function checks whether a user is allowed or not to open a socket connection.
//User is allowed if it is authenticated
function socketAuthCheckMiddleware(socket, next) {
  //check if request carries a token
  const token = socket.handshake.auth.token;
  //init error
  let error;

  //no token in the request, move to next middleware/route
  if (!token) {
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
    next();
  } catch (error) {
    error.customMessage = "User not authenticated";
    error.code = 401;
    next(error);
  }
}

//exports
module.exports = socketAuthCheckMiddleware;
