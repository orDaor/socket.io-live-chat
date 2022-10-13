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

    //enter new chat right at the beginning of chat list
    chatListGlobal.unshift(newChat);

    //display new chat
    displayOneChat(broadcastData.roomId, newChat.friendsNames, false, "prepend");
    setChatItemAsUnread(broadcastData.roomId);
    return;
  }

  //the pointed chat was found, then
  //push the received message to this destination chat
  chatListGlobal[destinationChatIndexGlobal].messages.push(
    broadcastData.message
  );

  //new content needs to be viewed on this chat
  chatListGlobal[destinationChatIndexGlobal].viewed = false;

  //move the targetted chat to first position
  chatListGlobal.unshift(chatListGlobal[destinationChatIndexGlobal]);
  chatListGlobal.splice(destinationChatIndexGlobal + 1, 1);

  //find chat on screen in the friends list
  let chatListDOM = document.querySelectorAll(".friend-chat-item");
  const chatListDOMArray = Array.from(chatListDOM); //this is needed because chatListDOM is not an array
  const destinationChatIndexDOM = chatListDOMArray.findIndex(function (chat) {
    return chat.dataset.roomId === broadcastData.roomId;
  });

  //friend chat item not found
  if (destinationChatIndexDOM === -1) {
    throw new Error("Destination chat on screen not found");
  }

  //move the targetted chat on screen at first position
  chatListDOM[destinationChatIndexDOM].parentElement.prepend(
    chatListDOM[destinationChatIndexDOM]
  );

  //get updated chat list items array after sorting
  chatListDOM = document.querySelectorAll(".friend-chat-item");

  //friend chat item found, check whether it is selected or not
  if (chatListDOM[0].classList.contains("friend-chat-item-selected")) {
    //se chat to viewed
    chatListGlobal[0].viewed = true;
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

    //in case of mobile view and only chat list is visible
    const isFriendsSectionVisibleOnMobile =
      window.innerWidth < 768 &&
      chatSectionElement.style.display === "none" &&
      friendsSectionElement.style.display === "block";

    //still notify a new message is received (mark as UN-read)
    if (isFriendsSectionVisibleOnMobile) {
      setChatItemAsRead(broadcastData.roomId);
      setChatItemAsUnread(broadcastData.roomId);
    }
  } else {
    //mark as UN-read
    setChatItemAsRead(broadcastData.roomId);
    setChatItemAsUnread(broadcastData.roomId);
  }
}
