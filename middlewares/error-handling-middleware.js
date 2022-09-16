//imports built-in
//...

//imports 3rd party
//...

//imports custom
const errorUtil = require("../utils/errors-util");

function errorHandlingMiddleware(error, req, res, next) {
  console.log(error);
  const errorMessage = "An error occured. Maybe try again later?";
  errorUtil.sendResponseErrorData(req, res, 500, errorMessage);
}

//export
module.exports = errorHandlingMiddleware;
