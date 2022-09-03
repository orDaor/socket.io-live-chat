//process broadcast notification from server on message send event
function onMessageReceiveBroadcast(broadcastNoty) {
  displayOneMessage(
    false,
    broadcastNoty.messageId,
    broadcastNoty.text,
    "left",
    false,
    false
  );
}

//process broadcast notification from server on message delete event
function onMessageDeleteBroadcast(broadcastNoty) {
  const messageId = broadcastNoty;
  hideOneMessage(messageId);
}
