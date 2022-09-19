//process ack from server on message send eventack
function onMessageSendAck(eventAck) {
  //message not saved as requested
  if (!eventAck.ok) {
    displayOneMessageErrorInfo("id-not-confirmed", eventAck.info);
    return;
  }

  //response ok
  setMessageId(eventAck.messageId);
}

//process ack from server on message read event
function onMessageReadAck(eventAck) {
  //clean from page all messages and error message
  cleanAllMessages();

  //could not fetch the messages
  if (!eventAck.ok) {
    displayMainErrorInfo(eventAck.info);
    return;
  }

  //response ok
  displayAllMessages(eventAck.messages);
}

//process ack from server on message delete
function onMessageDeleteAck(eventAck) {
  //could not delete the message
  if (!eventAck.ok) {
    displayOneMessageErrorInfo(eventAck.messageId, eventAck.info);
    return;
  }

  hideOneMessage(eventAck.messageId);
}
