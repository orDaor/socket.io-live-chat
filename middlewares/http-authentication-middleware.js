//imports 3rd party
const jwt = require("jsonwebtoken");

//imports custom
const authentication = require("../utils/authentication-util");

//verify user suthentication status
function httpAuthCheckMiddleware(req, res, next) {
  //check if request carries a token
  const token = req.body.token;

  //no token in the request, move to next middleware/route
  if (!token) {
    next();
    return;
  }

  //a token is found in the request,
  //check if user is authenticated (move this to the authentication middleware).
  //NOTE: callback is passed to verify(), therefor it is called in ASYNC way
  jwt.verify(
    token,
    "not-a-secret",
    { algorithms: ["HS256"] },
    function (error, jwtPayload) {
      authentication.jwtVerifyCallback(error, jwtPayload, res, next);
    }
  );
}

//exports
module.exports = httpAuthCheckMiddleware;
