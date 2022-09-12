//handle socket disconnection event
function onDisconnect(reason) {
  console.log(`User disconnected because: ${reason}`);
}

//exports
module.exports = {
  onDisconnect: onDisconnect,
};
