//process ack from server on user get invitation link ack
function onUserFetchInvitationLinkAck(ackData) {
  //hide loaders and re-enable buttons
  const buttons = friendsSectionElement
    .querySelector(".friends-control")
    .querySelectorAll("button");

  disableButtons(buttons, false);
  hideOneLoader("add-friend-loader");

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
  //target buttons to re-enable in the modal
  const buttons = modalSectionElement
    .querySelector(".modal-prompt")
    .querySelectorAll("button");

  hideOneLoader("modal-loader");
  disableButtons(buttons, false);

  //message was not deleted
  if (!ackData.ok) {
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
  //Clean/reset the target message values, so that it can not be displayed on screen anymore
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

//process ack from server on messages load ack
function onMessageLoadAck(ackData) {
  //Hide loader and re-enable loading of more messages
  hideOneLoader("messages-loader");
  disableLoadingOfMoreMessages = false;

  //could not fetch the messages
  if (!ackData.ok) {
    //hide loader
    return;
  }

  //target messages of the chat for which we load more messages
  const chatGlobalMessages = getChatGlobalByRoomId(ackData.roomId).messages; //from oldest to most recent
  const chatGlobalMoreMessages = ackData.moreMessages; //from most recent to oldest

  //enter the "more" messages in target chat global messages array
  for (const message of chatGlobalMoreMessages) {
    chatGlobalMessages.unshift(message);
  }

  //can Not display new received messages on screen, if the chat for which
  //those messages are collected is not selected
  const selectedRoomId =
    chatSectionElement.querySelector(".active-friends").dataset.roomId;
  if (selectedRoomId !== ackData.roomId) {
    return;
  }

  //NOTE: loop from most recent to oldest
  const messagesListElement = chatSectionElement.querySelector("ul");
  let iterationNumber = 1;
  for (const message of chatGlobalMoreMessages) {
    //config message
    let side;
    if (message.senderIsViewer) {
      side = "right";
    } else {
      side = "left";
    }

    //Create and display the message
    //NOTE: we prepend messages so that oldetst ones stay at the top
    const displayedMessage = displayOneMessage(
      false,
      message.messageId,
      message.text,
      side,
      "prepend",
      false //NO scrolling
    );

    //if messages list scroll position is at top, then compensate scroll position
    //to keep messages on screen at the same original place
    if (!messagesListElement.scrollTop) {
      //scroll list down by delta
      const scrollDelta =
        displayedMessage.clientHeight +
        getElementMargin(displayedMessage, "margin-bottom");
      messagesListElement.scrollTop =
        messagesListElement.scrollTop + scrollDelta;
      //do not enter here anymore
      iterationNumber = undefined;
    }
  }

  //hide loader...
}

//process ack from server on room cancel ack
function onRoomCancelAck(ackData) {
  //target buttons to re-enable in the modal
  const buttons = modalSectionElement
    .querySelector(".modal-prompt")
    .querySelectorAll("button");

  hideOneLoader("modal-loader");
  disableButtons(buttons, false);

  //response not ok
  if (!ackData.ok) {
    displayModalErrorInfo(ackData.info);
    return;
  }

  //response ok, mark target chat in the frontend as canceled
  const chatGlobal = getChatGlobalByRoomId(ackData.roomId);
  chatGlobal.friendsNames = undefined;
  chatGlobal.messages = undefined;
  chatGlobal.roomId = undefined;

  //clean messages from screen, and reset selected chat status
  cleanAllMessages();
  setActiveChatRoomId("");
  setActiveFriendName("");
  selectedChatItemGlobal = undefined;

  //remove this chat from friends section
  const friendChatItemElement = getChatItemByRoomId(ackData.roomId);
  hideOneChat(friendChatItemElement);

  //hide modal and chat section so that user can select a new chat
  hideModal();
  if (window.innerWidth < 768) {
    //in mobile display friends list, other wise is stucked
    displayFriendsSection(); 
  }
  hideChatSection();
}
