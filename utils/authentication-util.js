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
function jwtVerifyCallback(error, jwtPayload, res, next) {
  //token validation failed, move to next route
  if (error) {
    next();
    return;
  }

  //token is valid, memorize authentication data and move to next route
  res.locals.isAuthenticated = true;
  res.locals.userId = jwtPayload.userId;
  next();
}

//exports
module.exports = {
  jwtSignCallback: jwtSignCallback,
  jwtVerifyCallback: jwtVerifyCallback,
};
