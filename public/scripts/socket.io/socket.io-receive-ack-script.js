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
  //message not sent (not saved and not forwarded to the users in the room)
  if (!ackData.ok) {
    displayOneMessageErrorInfo(ackData.tempMessageId, ackData.info);
    return;
  }

  //response ok
  setMessageId(ackData.messageId, ackData.tempMessageId);
}
