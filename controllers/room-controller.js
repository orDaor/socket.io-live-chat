const Room = require("../models/room-model");
const User = require("../models/user-model");

//user accepts invitation request
async function accetpInvitationRequest(req, res, next) {
  //init response data
  let responseData = {};

  //get id of the invitation the user wants to accept
  const invitationId = req.body.invitationId;

  //find user who generated the invitation
  let inviter;
  try {
    inviter = await User.findByInvitationId(invitationId);
  } catch (error) {
    next(error);
    return;
  }

  //check if this user is already active inside any with the inviter
  let rooms;
  try {
    rooms = await Room.findManyByUserIds([res.locals.userId, inviter.userId]);
  } catch (error) {
    next(error);
    return;
  }

  //these users are already connected inside a room
  if (rooms.length > 0) {
    next(new Error("Users are already connected"));
    return;
  }

  //inviter was found, create a new room where to place this user together with the inviter
  const room = new Room([res.locals.userId, inviter.userId]);

  //save room in the DB
  let roomId;
  try {
    roomId = await room.save();
  } catch (error) {
    next(error);
    return;
  }

  responseData.roomId = roomId;
  responseData.message = "User joined successfully a new chat room";
  res.json(responseData);
}

//exports
module.exports = {
  accetpInvitationRequest: accetpInvitationRequest,
};
