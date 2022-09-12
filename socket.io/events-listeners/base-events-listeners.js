//imports custom
const baseEventsController = require("../controllers/base-events-controller");

//register base events listeners
function listenToBaseEvents(io, socket) {
  //disconnection
  socket.on("disconnect", baseEventsController.onDisconnect);

  //...
}

//exports
module.exports = listenToBaseEvents;
