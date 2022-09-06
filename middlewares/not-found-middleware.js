//imports built-in
//...

//imports 3rd party
//...

//imports custom
const errorUtil = require("../utils/errors-util");

//path not found
function notFoundMidlleware(req, res) {
  const errorMessage = "The requested resource was not found";
  errorUtil.sendResponseErrorData(req, res, 404, errorMessage);
}

//export
module.exports = notFoundMidlleware;
