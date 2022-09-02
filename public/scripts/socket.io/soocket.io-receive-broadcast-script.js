//process broadcast notification from server on message create event
function onMessageCreateBroadcast(broadcastNoty) {
  displayOneMessage(broadcastNoty.messageId, broadcastNoty.text);
}

//process broadcast notification from server on message update event
function onMessageUpdateBroadcast(broadcastNoty) {
  setMessageInput(broadcastNoty.messageId, broadcastNoty.text);
}

//process broadcast notification from server on message delete event
function onMessageDeleteBroadcast(broadcastNoty) {
  const messageId = broadcastNoty;
  hideOneMessage(messageId);
}
