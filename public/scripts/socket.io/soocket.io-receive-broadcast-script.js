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
    };

    //enter new chat right at the beginning of chat list
    chatListGlobal.unshift(newChat);

    //display new chat
    displayOneChat(newChat.roomId, newChat.friendsNames, false, "prepend");
    setChatItemAsUnread(newChat.roomId);
    return;
  }

  //the pointed chat was found, then
  //push the received message to this destination chat
  chatListGlobal[destinationChatIndexGlobal].messages.push(
    broadcastData.message
  );
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

  //get updated chat list items array after sorting
  chatListDOM = document.querySelectorAll(".friend-chat-item");

  //friend chat item found, check whether it is selected or not
  if (chatListDOM[0].classList.contains("friend-chat-item-selected")) {
    //enter the message in the message list
    displayOneMessage(
      false,
      "",
      broadcastData.message.text,
      "left",
      true, //to be checked
      "smooth"
    );
    //in case of mobile view and only chat list is visible
    const isFriendsSectionVisibleOnMobile =
      window.innerWidth < 768 &&
      chatSectionElement.style.display === "none" &&
      friendsSectionElement.style.display === "block";

    //still notify a new message is received (mark as UN-read)
    if (isFriendsSectionVisibleOnMobile) {
      setChatItemAsRead(chatListDOM[0].dataset.roomId);
      setChatItemAsUnread(chatListDOM[0].dataset.roomId);
    }
  } else {
    //mark as UN-read
    setChatItemAsRead(chatListDOM[0].dataset.roomId);
    setChatItemAsUnread(chatListDOM[0].dataset.roomId);
  }
}
