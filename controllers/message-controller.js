//imports 3rd party
const jwt = require("jsonwebtoken");

//read user chats
function readAll(req, res, next) {
  //init response data
  let responseData = {};

  //get rooms where user with res.locals.userId is active...

  
}

//exports
module.exports = {
  readAll: readAll,
};
