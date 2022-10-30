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
  //displayed target message
  const chatGlobal = getChatGlobalByRoomId(ackData.roomId);
  let messageGlobal = getChatGlobalMessageByMessageId(
    chatGlobal,
    ackData.tempMessageId
  );
  const displayedMessage = getMessageItemByMessageId(ackData.tempMessageId);

  //message not sent (not saved and not forwarded to the users in the room)
  if (!ackData.ok) {
    if (displayedMessage) {
      displayOneMessageErrorInfo(displayedMessage, ackData.info);
    }
    //failure
    messageGlobal.sendingFailed = true;
    return;
  }

  //response ok, message was sent successfully
  if (displayedMessage) {
    setMessageId(displayedMessage, ackData.message.messageId);
  }
  //success, update message in the global chat array
  messageGlobal.creationDate = ackData.message.creationDate;
  messageGlobal.messageId = ackData.message.messageId;
  messageGlobal.senderIsViewer = ackData.message.senderIsViewer;
  messageGlobal.sendingFailed = ackData.message.sendingFailed;
  messageGlobal.text = ackData.message.text;
}

//process ack from server on message delete ack
function onMessageDeleteAck(ackData) {
  //message was not deleted
  if (!ackData.ok) {
    hideModalErrorInfo();
    displayModalErrorInfo(ackData.info);
    return;
  }

  //find chat where message was deleted
  const chatGlobal = getChatGlobalByRoomId(ackData.roomId);
  //find the target deleted message
  const chatGlobalMessage = getChatGlobalMessageByMessageId(
    chatGlobal,
    ackData.messageId
  );
  //Reset the target message values, so that it can not be displayed on screen anymore
  chatGlobalMessage.creationDate = undefined;
  chatGlobalMessage.messageId = undefined;
  chatGlobalMessage.text = undefined;

  //remove modal and delete message from screen, in case it is displayed
  hideModal();
  const messageItemElement = getMessageItemByMessageId(ackData.messageId);
  if (messageItemElement) {
    hideOneMessage(messageItemElement);
  }

  //target chat on screen
  const friendChatItemElement = getChatItemByRoomId(ackData.roomId);

  //UPDATE the message preview
  const messagePreviewTextElement = friendChatItemElement.querySelector(
    ".friend-chat-preview p"
  );
  messagePreviewTextElement.textContent =
    getChatGlobalLastMessageText(chatGlobal);
}
