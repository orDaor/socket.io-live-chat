//request a link for inviting a friend
function fetchInvitationLink() {
  //init
  hideInvitationLink();
  hideFriendsControlErrorInfo();
  const errorInfo = "An error occured";
  const delay = 5000;

  //socket not connected
  if (!socket.connected) {
    displayFriendsControlErrorInfo(errorInfo);
    return;
  }

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    displayFriendsControlErrorInfo(errorInfo);
  }, delay);

  //send event
  socket.emit("user-fetch-invitation-link", {}, function (ackData) {
    clearTimeout(timerId);
    onUserFetchInvitationLinkAck(ackData);
  });
}

//send a chat message
function sendMessage(event) {
  event.preventDefault();
  const errorInfo = "An error occured";
  const delay = 8000;

  //user connected...
  const formData = new FormData(event.target);
  const activeChatElement = chatSectionElement.querySelector(".active-friends");

  //build message
  const tempMessageId = new Date().getTime().toString() + "-temp-id";
  console.log(tempMessageId);
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

  //display message right when sending it
  const displayedMessage = displayOneMessage(
    false,
    message.tempMessageId,
    message.text,
    "right",
    true,
    "smooth"
  );

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
      displayOneMessageErrorInfo(displayedMessage, errorInfo);
    }
    return;
  }

  //start ack timeout: callback executed if ack is not received within delay
  const timerId = setTimeout(function () {
    messageGlobal.sendingFailed = true;
    const displayedMessage = getMessageItemByMessageId(messageGlobal.messageId);
    if (displayedMessage) {
      displayOneMessageErrorInfo(displayedMessage, errorInfo);
    }
  }, delay);

  //send (emit) a event with a message to the server
  socket.emit("message-send", message, function (ackData) {
    clearTimeout(timerId);
    onMessageSendAck(ackData);
  }); //we can pass any data that can be encoded as JSON

  //clean form input
  event.target.querySelector("textarea[name='message']").value = "";
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
  console.log("Delete message: " + selectedMessageIdGlobal);
}
