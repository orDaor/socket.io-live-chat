//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const roomController = require("../controllers/room-controller");

//create router
const router = express.Router();

//invitation link handling
router.get("/invitation/:invitationId", roomController.handleInvitationLink);

//export
module.exports = router;
