//protect routes coming after this middleware by authentication check
function routesProtectionMiddleware(req, res, next) {
  //init reponse
  let responseData = {};

  //user not authenticated
  if (!res.locals.isAuthenticated) {
    //respond with 401 error code (authentication error)
    responseData.message = "User not authenticated";
    res.status(401).json(responseData);
    return;
  }

  //user is authenticated
  next();
}

module.exports = routesProtectionMiddleware;
