//process ack from server on message create event
function onMessageCreateAck(eventAck) {
  //message not saved as requested
  if (!eventAck.ok) {
    displayErrorInfo(eventAck.info);
    hideOneMessage("not-confirmed");
    return;
  }

  //response ok
  setMessageId(eventAck.messageId);
}

//process ack from server on message read event
function onMessageReadAck(eventAck) {
  //clean from page all messages and error message
  hideErrorInfo();
  cleanAllMessages();

  //could not fetch the messages
  if (!eventAck.ok) {
    displayErrorInfo(eventAck.info);
    return;
  }

  //response ok
  displayAllMessages(eventAck.messages);
}

//process ack from server on message update event
function onMessageUpdateAck(eventAck) {
  //could not update the message
  if (!eventAck.ok) {
    displayErrorInfo(eventAck.info);
    return;
  }
}

//process ack from server on message delete
function onMessageDeleteAck(eventAck) {
  //could not delete the message
  if (!eventAck.ok) {
    displayErrorInfo(eventAck.info);
    return;
  }

  hideOneMessage(eventAck.messageId);
}
