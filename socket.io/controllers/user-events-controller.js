//imports custom
const User = require("../../models/user-model");
const Room = require("../../models/room-model");

//invitation link generation
async function onUserFetchInvitationLink(socket, emptyObj, sendAck) {
  //init ack data
  let ackData = {};

  //let user wait just a little time to make him realize
  //a new link is actually being generated
  await new Promise((r) => setTimeout(r, 200));

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
    room = await Room.findWithOneUserWaiting(user.userId);
  } catch (error) {
    ackData.ok = false;
    ackData.info = "It is not possible to generate a link at the moment (1)";
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
    ackData.info = "It is not possible to generate a link at the moment (1)";
    sendAck(ackData);
    console.log(error);
    return;
  }

  //enter this socket in this room
  socket.join(room.roomId);

  ackData.ok = true;
  ackData.invitationLink = room.getInvitationLink();
  sendAck(ackData);
}

//user just accepted an invitation to a given room
async function onUserAcceptedInvitation(io, socket, roomId) {
  //this user wants to notify the other friends in roomId that he just joined this room. Then
  //check if user actually joined this room
  if (!socket.rooms.has(roomId)) {
    return;
  }

  //fetch user data
  let user;
  try {
    user = await User.findById(socket.userId);
  } catch {
    return;
  }

  //build notification thas this user send to others in the room to tell them he just entered
  const broadcastData = {
    userName: user.name,
    roomId: roomId,
  };

  //all sockets in this room
  const socketList = await io.in(roomId).fetchSockets();

  //broadcast "is typing" status only to sockets not opened by this user
  for (const socketItem of socketList) {
    if (socketItem.userId !== socket.userId) {
      socketItem.emit("user-accepted-invitation-broadcast", broadcastData);
    }
  }
}

//exports
module.exports = {
  onUserFetchInvitationLink: onUserFetchInvitationLink,
  onUserAcceptedInvitation: onUserAcceptedInvitation,
};
