//process broadcast notification from server on message send event
function onMessageReceiveBroadcast(broadcastData) {
  const message = broadcastData;
  displayOneMessage(
    false,
    "",
    message.text,
    message.creationDate,
    "left",
    false
  );

  //TODO: add message in chatListGlobal[]
}
