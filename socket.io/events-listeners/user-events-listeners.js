//imports custom
const userEventsController = require("../controllers/user-events-controller");

//register user events listeners
function listenToUserEvents(io, socket) {
  //user requests to generate an invitation link
  socket.on("user-fetch-invitation-link", function (emptyObj, sendAck) {
    userEventsController.onUserFetchInvitationLink(socket, emptyObj, sendAck);
  });

  //user just accepted and invitation to a specific room
  socket.on("user-accecpted-invitation", function (roomId) {
    userEventsController.onUserAcceptedInvitation(io, socket, roomId);
  });
}

//exports
module.exports = listenToUserEvents;
