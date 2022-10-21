//imports 3rd prty
const uuid = require("uuid").v4;

//imports custom
const User = require("../../models/user-model");
const Room = require("../../models/room-model");

//invitation link generation
async function onUserFetchInvitationLink(socket, emptyObj, sendAck) {
  //init ack data
  let ackData = {};

  //user asking for the link
  const userId = socket.userId;

  //check whether user still exist
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    ackData.ok = false;
    ackData.info = "This user does not exist";
    sendAck(ackData);
    console.log(error);
    return;
  }

  //check if this user already generated an invitation link
  let room;
  try {
    room = await Room.findWithOneUerWaiting(user.userId);
  } catch (error) {
    ackData.ok = false;
    ackData.info = "An error occured. Maybe try again later?";
    sendAck(ackData);
    console.log(error);
    return;
  }

  //a link was already generated, because a room where only this user is waiting was found
  if (room) {
    ackData.ok = true;
    ackData.invitationLink = room.getInvitationLink();
    sendAck(ackData);
    return;
  }

  //no link was already generated, so we can create a new one.
  //Create a chat room for this user, where it can invite other users. Then
  //the invitation link will point to this room
  room = new Room([user.userId]);
  let roomId;
  try {
    roomId = await room.save();
    room.roomId = roomId.toString();
  } catch (error) {
    ackData.ok = false;
    ackData.info = "An error occured. Maybe try again later?";
    sendAck(ackData);
    console.log(error);
    return;
  }

  ackData.ok = true;
  ackData.invitationLink = room.getInvitationLink();
  sendAck(ackData);
}

//exports
module.exports = {
  onUserFetchInvitationLink: onUserFetchInvitationLink,
};
