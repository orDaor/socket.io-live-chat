//request a link for inviting a friend
function fetchInvitationLink() {
  //init
  hideInvitationLink();
  hideFriendsControlErrorInfo();
  const connectionErrorInfo =
    "Can not reach the server. Maybe check your connection?";
  const delay = 5000;

  //socket not connected
  if (!socket.connected) {
    displayFriendsControlErrorInfo(connectionErrorInfo);
    return;
  }

  //display loader and disable buttons in this area
  const buttons = friendsSectionElement
    .querySelector(".friends-control")
    .querySelectorAll("button");

  displayAddFriendLoader();
  disableButtons(buttons, true);

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    displayFriendsControlErrorInfo("An error occured");
    disableButtons(buttons, false);
    hideOneLoader("add-friend-loader");
  }, delay);

  //collect timer id for clearing it at logout
  socketTimeoutIdsGlobal.push(timerId);

  //send event
  socket.emit("user-fetch-invitation-link", {}, function (ackData) {
    clearTimeout(timerId);
    onUserFetchInvitationLinkAck(ackData);
  });
}

//send a chat message
function sendMessage(event) {
  //INIT
  event.preventDefault();
  const connectionErrorInfo =
    "Can not reach the server. Maybe check your connection?";
  const delay = 8000;

  //user connected...
  const formData = new FormData(event.target);
  const activeChatElement = chatSectionElement.querySelector(".active-friends");

  //build message
  const tempMessageId = new Date().getTime().toString() + "-temp-id";
  const message = {
    text: formData.get("message").trim(),
    roomId: activeChatElement.dataset.roomId,
    creationDate: new Date(), //now
    tempMessageId: tempMessageId,
  };

  //if no input content, do nothing
  if (!message.text) {
    return;
  }

  //disable displaying of scroll to bottom button
  disableDisplayOfScrollToBottomButton = true;

  //display message right when sending it
  const displayedMessage = displayOneMessage(
    false,
    message.tempMessageId,
    message.text,
    "right",
    "append",
    true,
    "auto" //"smoot"
  );

  //clean form input
  resetTextAreaElement();

  //show message preview on chat item in friends list
  const friendChatItemElement = getChatItemByRoomId(message.roomId);
  const messagePreviewTextElement = friendChatItemElement.querySelector(
    ".friend-chat-preview p"
  );
  messagePreviewTextElement.textContent = message.text;

  //move friend chat item to 1st position
  friendChatItemElement.parentElement.prepend(friendChatItemElement);

  //destination chat global
  const chatGlobal = getChatGlobalByRoomId(message.roomId);

  //clean chached user input for this chat
  chatGlobal.currentInput = "";

  //init the message to enter the message in the chat global
  const messageGlobal = {
    creationDate: undefined,
    messageId: message.tempMessageId,
    senderIsViewer: true,
    sendingFailed: undefined,
    sendingFailedReason: "",
    text: message.text,
  };

  //push message in chat global
  chatGlobal.messages.push(messageGlobal);

  //user not connected...
  if (!socket.connected) {
    messageGlobal.sendingFailed = true;
    messageGlobal.sendingFailedReason = connectionErrorInfo;
    if (displayedMessage) {
      displayOneMessageErrorInfo(displayedMessage, connectionErrorInfo);
    }
    disableDisplayOfScrollToBottomButton = false;
    return;
  }

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    messageGlobal.sendingFailed = true;
    messageGlobal.sendingFailedReason = "An error occured";
    const displayedMessage = getMessageItemByMessageId(messageGlobal.messageId);
    if (displayedMessage) {
      displayOneMessageErrorInfo(displayedMessage, "An error occured");
    }
  }, delay);

  //collect timer id for clearing it at logout
  socketTimeoutIdsGlobal.push(timerId);

  //send (emit) a event with a message to the server
  socket.emit("message-send", message, function (ackData) {
    clearTimeout(timerId);
    onMessageSendAck(ackData);
  }); //we can pass any data that can be encoded as JSON
}

//tells the server this user viewd a specific chat room
function registerOneChatView(roomId) {
  //socket not connected
  if (!socket.connected) {
    return;
  }
  //request to save this chat view
  socket.emit("room-view", roomId);
}

//tell the other users in the room when a message is typing
function sendIsTypingStatus(event) {
  //handle text area height
  fitTextAreaHeightToText(event.target);

  //cache current input for the selected chat
  cacheCurrentInput(event.target);

  //socket not connected
  if (!socket.connected) {
    return;
  }
  //if a typing timer is already active, stop
  if (isTypingTimerActive_send) {
    return;
  }

  //room in which we are typing
  const roomId =
    chatSectionElement.querySelector(".active-friends").dataset.roomId;

  //timer config
  isTypingTimerActive_send = true;

  //Sending the typing info will be possible ONLY with minumum freuqnecy of "delay"
  isTypingTimerId_send = setTimeout(function () {
    isTypingTimerActive_send = false;
  }, isTypingTimerDelay_send);
  socket.emit("room-is-typing", roomId);
}

//online status: tell the suers in the rooms you are in, that you are alive
function sendOnlineStatus() {
  //socket not connected
  if (!socket.connected) {
    //stop sending cyclycally
    return;
  }
  //send status
  socket.emit("room-is-online", {});
}

//delete selected message
function deleteOneMessage(event) {
  //Init
  hideModalErrorInfo();
  const connectionErrorInfo =
    "Can not reach the server. Maybe check your connection?";
  const delay = 8000;

  //target message in chatListGlobal
  const selectedRoomId =
    chatSectionElement.querySelector(".active-friends").dataset.roomId;

  const chatGlobal = getChatGlobalByRoomId(selectedRoomId);

  const chatGlobaleMessage = getChatGlobalMessageByMessageId(
    chatGlobal,
    selectedMessageItemGlobal.dataset.messageId
  );

  //if user wants to delete a message which failed sending, then
  //just delete it from chatListGlobal and from screen and stop here
  if (chatGlobaleMessage.sendingFailed) {
    //clean (delete) from chatListGlobal
    chatGlobaleMessage.creationDate = undefined;
    chatGlobaleMessage.messageId = undefined;
    chatGlobaleMessage.text = undefined;

    //delete from screen
    hideOneMessage(selectedMessageItemGlobal);
    hideModal();
    //this will delete "scroll to bottom" button if there is no overflow after message deletion
    const messagesListElement = chatSectionElement.querySelector("ul");
    handleScrollToBottomIconVisibility(messagesListElement);
    return;
  }

  //user not connected...
  if (!socket.connected) {
    displayModalErrorInfo(connectionErrorInfo);
    return;
  }

  //display loader and disable buttons in this area
  const buttons = modalSectionElement
    .querySelector(".modal-prompt")
    .querySelectorAll("button");

  displayModalLoader();
  disableButtons(buttons, true);

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    displayModalErrorInfo("An error occured");
    //hide loader and re-enable buttons
    hideOneLoader("modal-loader");
    disableButtons(buttons, false);
  }, delay);

  //collect timer id for clearing it at logout
  socketTimeoutIdsGlobal.push(timerId);

  //data to be sent
  const message = {
    messageId: selectedMessageItemGlobal.dataset.messageId,
    roomId: selectedRoomId,
  };

  //send deletion request
  socket.emit("message-delete", message, function (ackData) {
    clearTimeout(timerId);
    onMessageDeleteAck(ackData);
  });
}

//load more messages for a fiven chat
//NOTE: this is called by "onMessagesListScroll" when messages list of a chat is scrolled to the top
function loadMoreMessages() {
  //config
  const delay = 8000;

  //user not connected or laoding of more messages forbidden at the moment
  if (!socket.connected || disableLoadingOfMoreMessages) {
    return;
  }

  console.log("Load more messages");

  //get selected chat room data
  const roomId =
    chatSectionElement.querySelector(".active-friends").dataset.roomId;
  const chatGlobal = getChatGlobalByRoomId(roomId);

  //tell the server which is the last "good" message user loaded
  //for this chat
  const eldestMessage = getChatGlobalEldestMessage(chatGlobal);
  let eldestMessageData = {};
  if (!eldestMessage) {
    eldestMessageData.messageId = "";
    eldestMessageData.creationDate = "";
  } else {
    eldestMessageData.messageId = eldestMessage.messageId;
    eldestMessageData.creationDate = eldestMessage.creationDate;
  }
  eldestMessageData.roomId = roomId;

  //display loader and disable loading of more messages and other chats selection
  displayMessagesLoader();
  disableLoadingOfMoreMessages = true;
  keepUserOnSelectedChat(roomId);

  //start timer and send request
  const timerId = setTimeout(function () {
    if (!getChatGlobalByRoomId(roomId)) {
      //no timeout actions
      return;
    }
    //hide loader and re-enable loading of more messages
    hideOneLoader("messages-loader");
    disableLoadingOfMoreMessages = false;
    letUserSelectOtherChats();
  }, delay);

  //collect timer id for clearing it at logout
  socketTimeoutIdsGlobal.push(timerId);

  //send request
  socket.emit("message-load", eldestMessageData, function (ackData) {
    clearTimeout(timerId);
    onMessageLoadAck(ackData);
  });
}

//notify to friend that this user just accepted an invitation
function notifyInvitationAcceptance(roomId) {
  //not connected
  if (!socket.connected) {
    return;
  }

  //send notification
  socket.emit("user-accepted-invitation", roomId);
}

//delete a friend with whom user is active inside of a chat room
function cancelChat(event) {
  //init
  hideModalErrorInfo();
  const delay = 8000;
  const roomId =
    chatSectionElement.querySelector(".active-friends").dataset.roomId;
  const connectionErrorInfo =
    "Can not reach the server. Maybe check your connection?";

  //not connected
  if (!socket.connected) {
    displayModalErrorInfo(connectionErrorInfo);
    return;
  }

  //display loader and disable buttons in this area
  const buttons = modalSectionElement
    .querySelector(".modal-prompt")
    .querySelectorAll("button");

  displayModalLoader();
  disableButtons(buttons, true);

  const timerId = setTimeout(function () {
    displayModalErrorInfo(connectionErrorInfo);
    //hide loader and re-enable buttons
    hideOneLoader("modal-loader");
    disableButtons(buttons, false);
  }, delay);

  //collect timer id for clearing it at logout
  socketTimeoutIdsGlobal.push(timerId);

  socket.emit("room-cancel", roomId, function (ackData) {
    clearTimeout(timerId);
    onRoomCancelAck(ackData);
  });
}
