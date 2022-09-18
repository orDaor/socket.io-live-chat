//imports built in
//...

//imports 3rd party
//...

//imports custom
//...

function addCsrfTokenMIddleware(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
}

//export
module.exports = addCsrfTokenMIddleware;