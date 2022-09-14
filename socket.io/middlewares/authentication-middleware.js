//imports 3rd party
const jwt = require("jsonwebtoken");

//this function checks whether a user is allowed or not to open a socket connection.
//User is allowed if it is authenticated
function checkUserAuthStatus(socket, next) {
  //...
  //next();
}

//exports
module.exports = checkUserAuthStatus;
