//request a link for inviting a friend
function fetchInvitationLink() {
  //init
  hideInvitationLink();
  hideFriendsControlErrorInfo();
  const connectionErrorInfo =
    "Can not reach the server. May check your connection?";
  const delay = 5000;

  //socket not connected
  if (!socket.connected) {
    displayFriendsControlErrorInfo(connectionErrorInfo);
    return;
  }

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    displayFriendsControlErrorInfo("An error occured");
  }, delay);

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
    "Can not reach the server. May check your connection?";
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
  event.target.querySelector("textarea[name='message']").value = "";

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

  //init the message to enter the message in the chat global
  const messageGlobal = {
    creationDate: undefined,
    messageId: message.tempMessageId,
    senderIsViewer: true,
    sendingFailed: undefined,
    text: message.text,
  };

  //push message in chat global
  chatGlobal.messages.push(messageGlobal);

  //user not connected...
  if (!socket.connected) {
    messageGlobal.sendingFailed = true;
    if (displayedMessage) {
      displayOneMessageErrorInfo(displayedMessage, connectionErrorInfo);
    }
    return;
  }

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    messageGlobal.sendingFailed = true;
    const displayedMessage = getMessageItemByMessageId(messageGlobal.messageId);
    if (displayedMessage) {
      displayOneMessageErrorInfo(displayedMessage, "An error occured");
    }
  }, delay);

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
  const connectionErrorInfo =
    "Can not reach the server. May check your connection?";
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
    return;
  }

  //user not connected...
  if (!socket.connected) {
    hideModalErrorInfo();
    displayModalErrorInfo(connectionErrorInfo);
    return;
  }

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    hideModalErrorInfo();
    displayModalErrorInfo("An error occured");
  }, delay);

  //send deletion request
  socket.emit(
    "message-delete",
    selectedMessageItemGlobal.dataset.messageId,
    function (ackData) {
      clearTimeout(timerId);
      onMessageDeleteAck(ackData);
    }
  );
}

//load more messages for a fiven chat
//NOTE: this is called by "onMessagesListScroll" when messages list of a chat is scrolled to the top
function loadMoreMessages() {
  //config
  const delay = 8000;

  //user not connected
  if (!socket.connected) {
    return;
  }

  //get selected chat room data
  const roomId =
    chatSectionElement.querySelector(".active-friends").dataset.roomId;
  const chatGlobal = getChatGlobalByRoomId(roomId);

  //how many messages for this chat did the user already laod
  //NOTE: deleted messages, and messages who faild sending, are not included
  //because they are not saved in th DB
  //NOTE: the backend decides how many more messages to give the user
  const currentMessagesNumber =
    chatGlobal.messages.length - getActualChatGlobalMessagesNumber(chatGlobal);

  //send request for laoding more messages
  const eventData = {
    roomId: roomId,
    currentMessagesNumber: currentMessagesNumber,
  };

  //display messages list loader on screen

  //start timer and send request
  const timerId = setTimeout(function () {
    //hide loader...
  }, delay);

  //send request
  socket.emit("message-load", eventData, function (ackData) {
    clearTimeout(timerId);
    onMessageLoadAck(ackData);
    //hide messages list loader...
  });
}
