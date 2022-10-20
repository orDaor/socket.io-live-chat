//process broadcast notification from server on message send event
function onMessageReceiveBroadcast(broadcastData) {
  //init
  let thisUserName = localStorage.getItem("user-name");
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
    };

    //enter new chat in the chat list
    chatListGlobal.push(newChat);

    //display new chat
    displayOneChat(
      broadcastData.roomId,
      newChat.friendsNames,
      false,
      "prepend",
      newChat.viewed //false
    );

    //update notification counter
    updateNewMessagesCount("increment");
    return;
  }

  //the pointed chat was found, then
  //push the received message to this destination chat
  chatListGlobal[destinationChatIndexGlobal].messages.push(
    broadcastData.message
  );

  //new content needs to be viewed on this chat
  if (chatListGlobal[destinationChatIndexGlobal].viewed) {
    updateNewMessagesCount("increment");
  }
  chatListGlobal[destinationChatIndexGlobal].viewed = false;

  //move the targetted chat on screen at first position
  const friendChatItemElement = getChatItemByRoomId(broadcastData.roomId);
  friendChatItemElement.parentElement.prepend(friendChatItemElement);

  //check whether destination chat is selected or not
  if (friendChatItemElement.classList.contains("friend-chat-item-selected")) {
    //reset "is typing" info and timer
    hideIsTypingInfo();
    clearTimeout(isTypingTimerId_receive);
    isTypingTimerId_receive = null;
    isTypingTimerActive_receive = false;

    //handle th received message
    if (
      window.innerWidth >= 768 ||
      (window.innerWidth < 768 &&
        chatSectionElement.style.display === "flex" &&
        friendsSectionElement.style.display === "none")
    ) {
      //se chat to viewed
      if (!chatListGlobal[destinationChatIndexGlobal].viewed) {
        updateNewMessagesCount("decrement");
      }
      chatListGlobal[destinationChatIndexGlobal].viewed = true;
      //tell the server this user is viewing this chat
      registerOneChatView(broadcastData.roomId);

      //when arrives the new messages in desktop view, before displaying it,
      //chek if scroll position is already at the bottom, then scroll
      const messagesListElement = chatSectionElement.querySelector("ul");
      let scrollToBottomRequest = false;

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
      }

      //enter the message in the message list without scrolling
      displayOneMessage(false, "", broadcastData.message.text, "left");

      //scroll to bottom
      if (scrollToBottomRequest) {
        scrollToBottomRequest = false;
        scrollToBottomOfMessagesList("smooth");
      }
    } else if (
      window.innerWidth < 768 &&
      chatSectionElement.style.display === "none" &&
      friendsSectionElement.style.display === "block"
    ) {
      //enter the message in the message list without scrolling
      displayOneMessage(false, "", broadcastData.message.text, "left");
      setChatItemAsRead(friendChatItemElement);
      setChatItemAsUnread(friendChatItemElement);
    }
  } else {
    //mark as UN-read
    setChatItemAsRead(friendChatItemElement);
    setChatItemAsUnread(friendChatItemElement);
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
