//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const roomController = require("../controllers/room-controller");

//create router
const router = express.Router();

//user accept invitation request
router.post("/join", roomController.accetpInvitationRequest);

//export
module.exports = router;
