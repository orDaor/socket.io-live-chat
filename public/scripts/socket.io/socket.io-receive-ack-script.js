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
  //dislayed target message
  const displayedMessage = getMessageItemByMessageId(ackData.tempMessageId);

  //message not sent (not saved and not forwarded to the users in the room)
  if (!ackData.ok) {
    displayOneMessageErrorInfo(displayedMessage, ackData.info);
    return;
  }

  //response ok, update message id on screen
  setMessageId(displayedMessage, ackData.message.messageId);

  //add message in chatListGlobal, in the destination chat room
  const chat = getChatGlobalByRoomId(ackData.roomId);
  chat.messages.push(ackData.message);

  //move the targetted chat on screen at first position
  const friendChatItemElement = getChatItemByRoomId(ackData.roomId);
  friendChatItemElement.parentElement.prepend(friendChatItemElement);
}
