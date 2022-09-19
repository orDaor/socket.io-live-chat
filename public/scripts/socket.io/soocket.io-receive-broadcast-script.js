//process broadcast notification from server on message send event
function onMessageReceiveBroadcast(broadcastNoty) {
  const message = broadcastNoty;
  displayOneMessage(
    false,
    message.messageId,
    message.text,
    message.creationDate,
    "left",
    false
  );
}

//process broadcast notification from server on message delete event
function onMessageDeleteBroadcast(broadcastNoty) {
  const messageId = broadcastNoty;
  hideOneMessage(messageId);
}
