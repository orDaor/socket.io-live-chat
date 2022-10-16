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
      setChatItemAsRead(broadcastData.roomId);
      setChatItemAsUnread(broadcastData.roomId);
    }
  } else {
    //mark as UN-read
    setChatItemAsRead(broadcastData.roomId);
    setChatItemAsUnread(broadcastData.roomId);
  }
}
