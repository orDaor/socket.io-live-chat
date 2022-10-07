//process broadcast notification from server on message send event
function onMessageReceiveBroadcast(broadcastData) {
  //init
  let thisUserName = localStorage.getItem("user-name");

  //check if the room id to which the received message points, is in the chatListGlobal array
  const destinationChatIndexGlobal = chatListGlobal.indexOf(function (chat) {
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

    //enter new chat
    chatListGlobal.push(newChat);

    //display new chat
    displayOneChat(newChat.roomId, newChat.friendsNames);
    return;
  }

  //the pointed chat was found, then
  //push the received message to this destination chat
  chatListGlobal[destinationChatIndexGlobal].messages.push(
    broadcastData.message
  );

  //find chat on screen in the friends list
  const chatListDOM = document.querySelectorAll(".friend-chat-item");
  const destinationChatIndexDOM = chatListDOM.indexOf(function (chat) {
    return (
      chat.dataset.roomId === chatListGlobal[destinationChatIndexGlobal].roomId
    );
  });

  //friend chat item not found
  if (destinationChatIndexDOM === -1) {
    throw new Error("Destination chat on screen not found");
  }

  //friend chat item found, check whether it is selected or not
  if (
    chatListDOM[destinationChatIndexDOM].classList.contains(
      "friend-chat-item-selected"
    )
  ) {
    displayOneMessage(
      false,
      "",
      broadcastData.message.text,
      broadcastData.message.creationDate,
      "left",
      true //to be checked
    );
  } else {
    //mark as UN-read
    setChatItemAsUnread(chatListDOM[destinationChatIndexDOM].dataset.roomId);
  }
}
