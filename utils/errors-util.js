//build response data in case of errors (505, 404, ...)
function sendResponseErrorData(req, res, errorCode, errorMessage) {
  //check if the request forwarded here is an ajax request
  const acceptedResponseData = req.accepts(["html", "json"]);

  //if the request is ajax it wants json data as response,
  //otherwise it wants html data
  if (acceptedResponseData === "html") {
    res.redirect(`/${errorCode}`);
  } else if (acceptedResponseData === "json") {
    const reponseData = {
      message: errorMessage,
    };
    res.status(errorCode).json(reponseData);
  }
}

//exports
module.exports = {
  sendResponseErrorData: sendResponseErrorData,
};
