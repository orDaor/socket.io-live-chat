//imports 3rd party
const jwt = require("jsonwebtoken");
const authentication = require("../utils/authentication");

//read user chats
function readAll(req, res, next) {
  //init response data
  let responseData = {};

  //received token
  const token = req.body.token;

  //check if user is authenticated (move this to the authentication middleware)
  jwt.verify(
    token,
    "not-a-secret",
    { algorithms: ["HS256"] },
    function (error, jwtPayload) {
      authentication.jwtVerifyCallback(
        error,
        jwtPayload,
        res,
        responseData,
        next
      );
    }
  );
}

//exports
module.exports = {
  readAll: readAll,
};
