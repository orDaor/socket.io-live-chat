//this is executed on JWT creation
function jwtSignCallback(error, token, res, responseData, next) {
  //token creation error
  if (error) {
    next(error);
    return;
  }

  //response
  responseData.token = token;
  responseData.message = "Login successfull";
  res.json(responseData);
}

//this is executed on JWT validation
function jwtVerifyCallback(error, jwtPayload, res, responseData, next) {
  //
}

//exports
module.exports = {
  jwtSignCallback: jwtSignCallback,
  jwtVerifyCallback: jwtVerifyCallback,
};
