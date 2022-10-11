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

  //response ok, update message id on screen
  setMessageId(ackData.message.messageId, ackData.tempMessageId);

  //add message in chatListGlobal, in the destination chat room
  const destinationChatIndexGlobal = chatListGlobal.findIndex(function (chat) {
    return chat.roomId === ackData.roomId;
  });

  if (destinationChatIndexGlobal > -1) {
    chatListGlobal[destinationChatIndexGlobal].messages.push(ackData.message);
  } else {
    throw new Error("Destination chat in chatListGlobal[] not found");
  }

  //move the targetted chat to first position
  chatListGlobal.unshift(chatListGlobal[destinationChatIndexGlobal]);
  chatListGlobal.splice(destinationChatIndexGlobal + 1, 1);

  //find chat on screen in the friends list
  let chatListDOM = document.querySelectorAll(".friend-chat-item");
  const chatListDOMArray = Array.from(chatListDOM); //this is needed because chatListDOM is not an array
  const destinationChatIndexDOM = chatListDOMArray.findIndex(function (chat) {
    return chat.dataset.roomId === chatListGlobal[0].roomId;
  });

  //friend chat item not found
  if (destinationChatIndexDOM === -1) {
    throw new Error("Destination chat on screen not found");
  }

  //move the targetted chat on screen at first position
  chatListDOM[destinationChatIndexDOM].parentElement.prepend(
    chatListDOM[destinationChatIndexDOM]
  );
}
