const Room = require("../models/room-model");

//user accepts invitation request
async function accetpInvitationRequest(req, res, next) {
  //init response data
  let responseData = {};

  //get id of the invitation the user wants to accept
  const invitationId = req.body.invitationId;

  //check if the user can actually access this room
  let result;
  try {
    result = await Room.checkAvailability(invitationId);
  } catch (error) {
    next(error);
    return;
  }

  //room is accessible, then check if user is inviting himself
  if (result.inviter.userId === res.locals.userId) {
    next(new Error("User tries to invite himself"));
    return;
  }

  //enter the user in the room he is invited in
  const dateNow = new Date();
  result.room.friends.push(res.locals.userId);
  result.room.lastViewDates.push(dateNow); //now
  result.room.lastActivityDate = dateNow;
  try {
    await result.room.save();
  } catch (error) {
    next(error);
    return;
  }

  //response ok
  responseData.message = "User joined successfully a new chat room";
  res.json(responseData);
}

//exports
module.exports = {
  accetpInvitationRequest: accetpInvitationRequest,
};
