//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const messageController = require("../controllers/message-controller");

//create router
const router = express.Router();

//fetch all user chats
router.post("/all", messageController.readAll);

//export
module.exports = router;
