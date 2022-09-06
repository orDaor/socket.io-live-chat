//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const userController = require("../controllers/user-controller");

//create router
const router = express.Router();

//user signup
router.post("/signup", userController.signup);

//user login
router.post("/login", userController.login);

//export
module.exports = router;