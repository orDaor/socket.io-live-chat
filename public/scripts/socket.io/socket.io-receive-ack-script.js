//process ack from server on user get invitation link ack
function onUserFetchInvitationLinkAck(ackData) {
  //link was not generated
  if (!ackData.ok) {
    displayFriendsControlErrorInfo(ackData.info);
    return;
  }

  //link generation ok
  displayInvitationLink(ackData.invitationLink);
}

//process ack from server on message send ack
function onMessageSendAck(ackData) {
  //message not saved as requested
  if (!ackData.ok) {
    displayOneMessageErrorInfo("id-not-confirmed", ackData.info);
    return;
  }

  //response ok
  setMessageId(ackData.messageId);
}

//process ack from server on message read ack
function onMessageReadAck(ackData) {
  //clean from page all messages and error message
  cleanAllMessages();

  //could not fetch the messages
  if (!ackData.ok) {
    displayMainErrorInfo(ackData.info);
    return;
  }

  //response ok
  displayAllMessages(ackData.messages);
}

//process ack from server on message delete ack
function onMessageDeleteAck(ackData) {
  //could not delete the message
  if (!ackData.ok) {
    displayOneMessageErrorInfo(ackData.messageId, ackData.info);
    return;
  }

  hideOneMessage(ackData.messageId);
}
