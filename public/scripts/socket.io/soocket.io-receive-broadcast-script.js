//process broadcast notification from server on message send event
function onMessageReceiveBroadcast(broadcastData) {
  //init
  let thisUserName = localStorage.getItem("user-name");

  //check if the received message was sent by this user from another tab/browser instance,
  //or if it was actually sent by another user (this will be used below when displaying the message
  //on screen in case the received message has as destination a chat whic is now selected)
  let messageDisplaySide;
  if (broadcastData.message.senderIsViewer) {
    messageDisplaySide = "right"; //display on screen on RIGHT side
  } else {
    messageDisplaySide = "left"; //display on screen on LEFT side
  }

  //check if the room id to which the received message points, is in the chatListGlobal array
  const destinationChatIndexGlobal = chatListGlobal.findIndex(function (chat) {
    return chat.roomId === broadcastData.roomId;
  });

  //chat not present yet, then add it
  if (destinationChatIndexGlobal === -1) {
    //remove this user name from this chat friends names
    const index = broadcastData.friendsNames.indexOf(thisUserName);
    if (index > -1) {
      broadcastData.friendsNames.splice(index, 1);
    } else {
      throw new Error("Can not find this user name");
    }

    //new chat to be entered with a first message
    const newChat = {
      errorList: [],
      friendsNames: broadcastData.friendsNames,
      messages: [broadcastData.message],
      roomId: broadcastData.roomId,
      viewed: false, //new chat that needs to be viewed
      onlineStatusTimer: {
        timerId: null,
        active: false,
      },
      currentInput: "",
    };

    //NO new content to be viewed if the messages was sent this user
    if (broadcastData.message.senderIsViewer) {
      newChat.viewed = true;
    }

    //enter new chat in the chat list
    chatListGlobal.push(newChat);

    //display new chat
    displayOneChat(
      broadcastData.roomId,
      newChat.friendsNames,
      true,
      "prepend",
      newChat.viewed,
      getChatGlobalLastMessageText(newChat)
    );

    //update notification counter
    //NO new content to be viewed if the messages was sent this user himself
    if (!broadcastData.message.senderIsViewer) {
      updateNewMessagesCount("increment");
    }
    return;
  }

  //if destination chat is a chat which failed to be loaded,
  //stop here
  if (chatListGlobal[destinationChatIndexGlobal].errorList.length) {
    return;
  }

  //the pointed chat was found, then
  //push the received message to this destination chat
  chatListGlobal[destinationChatIndexGlobal].messages.push(
    broadcastData.message
  );

  //target chat on screen
  const friendChatItemElement = getChatItemByRoomId(broadcastData.roomId);

  //display message preview
  const messagePreviewTextElement = friendChatItemElement.querySelector(
    ".friend-chat-preview p"
  );
  messagePreviewTextElement.textContent = broadcastData.message.text;

  //move the targetted chat on screen at first position
  friendChatItemElement.parentElement.prepend(friendChatItemElement);

  //check whether destination chat is selected or not
  if (friendChatItemElement.classList.contains("friend-chat-item-selected")) {
    //reset "is typing" info and timer
    hideIsTypingInfo();
    clearTimeout(isTypingTimerId_receive);
    isTypingTimerId_receive = null;
    isTypingTimerActive_receive = false;

    //handle the received message
    if (
      window.innerWidth >= 768 ||
      (window.innerWidth < 768 &&
        chatSectionElement.style.display === "flex" &&
        friendsSectionElement.style.display === "none")
    ) {
      //when arrives the new messages in desktop view, before displaying it,
      //chek if scroll position is already at the bottom, then scroll
      const messagesListElement = chatSectionElement.querySelector("ul");
      let scrollToBottomRequest = false;

      //tell the server this user is viewing this chat, only if this user
      //did not send this message to himself
      if (!broadcastData.message.senderIsViewer) {
        registerOneChatView(broadcastData.roomId);
      }

      //check if message list is already scrolled at bottom
      const isMessagesListAtBottom =
        Math.abs(
          messagesListElement.scrollTop +
            messagesListElement.clientHeight -
            messagesListElement.scrollHeight
        ) < 5;

      //scroll to bottom request
      if (isMessagesListAtBottom) {
        scrollToBottomRequest = true;
      } else {
        //display animated scroll to bottom icon
        hideScrollToBottomIcon(messagesListElement);
        displayScrollToBottomIcon(messagesListElement, true);
      }

      //enter the message in the message list without scrolling
      displayOneMessage(
        false,
        broadcastData.message.messageId,
        broadcastData.message.text,
        messageDisplaySide,
        "append"
      );

      //scroll to bottom
      if (scrollToBottomRequest) {
        scrollToBottomRequest = false;
        disableDisplayOfScrollToBottomButton = true;
        scrollToBottomOfMessagesList("smooth");
      }
    } else if (
      window.innerWidth < 768 &&
      chatSectionElement.style.display === "none" &&
      friendsSectionElement.style.display === "flex"
    ) {
      //enter the message in the message list without scrolling
      displayOneMessage(
        false,
        broadcastData.message.messageId,
        broadcastData.message.text,
        messageDisplaySide,
        "append"
      );

      //notify new content only if message was not sent by this user himself
      if (!broadcastData.message.senderIsViewer) {
        if (chatListGlobal[destinationChatIndexGlobal].viewed) {
          setChatItemAsUnread(friendChatItemElement);
          updateNewMessagesCount("increment");
          chatListGlobal[destinationChatIndexGlobal].viewed = false;
        }
      }
    }
  } else {
    //notify new content only if message was not sent by this user himself
    if (!broadcastData.message.senderIsViewer) {
      if (chatListGlobal[destinationChatIndexGlobal].viewed) {
        setChatItemAsUnread(friendChatItemElement);
        updateNewMessagesCount("increment");
        chatListGlobal[destinationChatIndexGlobal].viewed = false;
      }
    }
  }
}

//someone in a give room is typing
function onRoomIsTypingBroadcast(broadcastData) {
  //target chat room where someone is tying
  const roomId = broadcastData;
  const activeFriendsElement =
    chatSectionElement.querySelector(".active-friends");

  //"is typing" status is displayed only on selected chat
  if (activeFriendsElement.dataset.roomId !== roomId) {
    return;
  }

  //we can not display "is typing" message while timer is stilla active
  if (isTypingTimerActive_receive) {
    //clear current active timer
    clearTimeout(isTypingTimerId_receive);

    //start new timer
    isTypingTimerId_receive = setTimeout(function () {
      isTypingTimerId_receive = null;
      isTypingTimerActive_receive = false;
      hideIsTypingInfo();
    }, isTypingTimerDelay_receive);
  } else {
    //timer config
    isTypingTimerActive_receive = true;

    //start timer
    isTypingTimerId_receive = setTimeout(function () {
      isTypingTimerId_receive = null;
      isTypingTimerActive_receive = false;
      hideIsTypingInfo();
    }, isTypingTimerDelay_receive);

    //display "is typing info"
    displayIsTypingInfo();
  }
}

//someone in a given room is telling it is alive (online)
function onRoomIsOnlineBroadcast(broadcastData) {
  //find chat room in global chat list
  const roomId = broadcastData;
  const chatGlobal = getChatGlobalByRoomId(roomId);
  if (!chatGlobal) {
    return;
  }

  //find chat room in friends list
  const friendChatItem = getChatItemByRoomId(roomId);
  if (!friendChatItem) {
    return;
  }

  //friend is already online
  if (chatGlobal.onlineStatusTimer.active) {
    //clear timer and start a new one
    clearTimeout(chatGlobal.onlineStatusTimer.timerId);
    chatGlobal.onlineStatusTimer.timerId = setTimeout(function () {
      //display friend as offline
      setOneChatOnlineStatus(friendChatItem, false);
      //timer for this chat is not active
      chatGlobal.onlineStatusTimer.active = false;
      chatGlobal.onlineStatusTimer.timerId = null;
    }, friendIsOnlineTimerDelay);
    //
  } else {
    //display friend online status on screen
    setOneChatOnlineStatus(friendChatItem, true);

    //memorize friend is online in this chat room, by activating timer
    chatGlobal.onlineStatusTimer.timerId = setTimeout(function () {
      //display friend as offline
      setOneChatOnlineStatus(friendChatItem, false);
      //timer for this chat is not active
      chatGlobal.onlineStatusTimer.active = false;
      chatGlobal.onlineStatusTimer.timerId = null;
    }, friendIsOnlineTimerDelay);

    //timer active flag
    chatGlobal.onlineStatusTimer.active = true;
  }
}

//a message was deleted in a chat by some friend
function onMessageDeleteBroadcast(broadcastData) {
  //find chat where message was deleted
  const chatGlobal = getChatGlobalByRoomId(broadcastData.roomId);
  if (!chatGlobal) {
    return;
  }

  //find the target deleted message
  const chatGlobalMessage = getChatGlobalMessageByMessageId(
    chatGlobal,
    broadcastData.messageId
  );

  //message not loaded yet, it can not be deleted
  if (!chatGlobalMessage) {
    return;
  }

  //Reset the target message values, so that it can not be displayed on screen anymore
  chatGlobalMessage.creationDate = undefined;
  chatGlobalMessage.messageId = undefined;
  chatGlobalMessage.text = undefined;

  //delete message on screen, in case it is displayed
  const messageItemElement = getMessageItemByMessageId(broadcastData.messageId);
  if (messageItemElement) {
    hideOneMessage(messageItemElement);
    //this will delete "scroll to bottom" button if there is no overflow after message deletion
    const messagesListElement = chatSectionElement.querySelector("ul");
    handleScrollToBottomIconVisibility(messagesListElement);
  }

  //target chat on screen
  const friendChatItemElement = getChatItemByRoomId(broadcastData.roomId);

  //UPDATE the message preview
  const messagePreviewTextElement = friendChatItemElement.querySelector(
    ".friend-chat-preview p"
  );
  messagePreviewTextElement.textContent =
    getChatGlobalLastMessageText(chatGlobal);
}

//a friend accepted invitation
function onUserAcceptedInvitationBroadcast(broadcastData) {
  //friend data
  const friendName = broadcastData.userName;
  const roomId = broadcastData.roomId;

  //if for some reason we already registered a chat global for this
  //friend, then stop here
  if (getChatGlobalByRoomId(roomId)) {
    return;
  }

  //new chat to be entered
  const newChat = {
    errorList: [],
    friendsNames: [friendName],
    messages: [],
    roomId: roomId,
    viewed: false, //new chat that needs to be viewed
    onlineStatusTimer: {
      timerId: null,
      active: false,
    },
    currentInput: "",
  };

  //enter new chat in the chat list
  chatListGlobal.push(newChat);

  //display new chat
  displayOneChat(
    roomId,
    newChat.friendsNames,
    true,
    "prepend",
    newChat.viewed, //false
    getChatGlobalLastMessageText(newChat)
  );

  //update notification counter
  updateNewMessagesCount("increment");
  return;
}
