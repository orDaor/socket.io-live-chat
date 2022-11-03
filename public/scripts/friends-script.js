//display one chat
function displayOneChat(
  roomId,
  friendsNames,
  isOnline,
  position,
  viewed,
  lastMessageText
) {
  const friendInfoElement = document.createElement("div");
  friendInfoElement.classList.add("friend-chat-main-info");

  const friendChatItemElement = document.createElement("li");
  friendChatItemElement.classList.add("friend-chat-item");
  friendChatItemElement.dataset.roomId = roomId;
  friendChatItemElement.addEventListener("click", selectOneChat);

  //online status of the chat
  const chatOnlineStatus = document.createElement("p");
  chatOnlineStatus.classList.add("friend-chat-status");
  if (isOnline) {
    chatOnlineStatus.classList.add("friend-chat-status-online");
    chatOnlineStatus.classList.remove("friend-chat-status-offline");
  } else {
    chatOnlineStatus.classList.add("friend-chat-status-offline");
    chatOnlineStatus.classList.remove("friend-chat-status-online");
  }

  //friend name
  const friendNameElement = document.createElement("p");
  friendNameElement.textContent = friendsNames[0]; // to be checked !!
  friendNameElement.classList.add("friend-chat-name");

  //init preview
  const messagePreviewElement = document.createElement("div");
  messagePreviewElement.classList.add("friend-chat-preview");
  const messagePreviewTextElement = document.createElement("p");

  //append chat content
  friendInfoElement.appendChild(chatOnlineStatus);
  friendInfoElement.appendChild(friendNameElement);
  messagePreviewElement.appendChild(messagePreviewTextElement);
  friendChatItemElement.appendChild(friendInfoElement);
  friendChatItemElement.appendChild(messagePreviewElement);

  //append or prepend the chat room inside the chat list
  const friendSectionListElement = friendsSectionElement.querySelector("ul");
  if (position === "append") {
    friendSectionListElement.appendChild(friendChatItemElement);
  } else if (position === "prepend") {
    friendSectionListElement.prepend(friendChatItemElement);
  } else {
    //default append
    friendSectionListElement.appendChild(friendChatItemElement);
  }

  //compute message preview
  messagePreviewTextElement.textContent = lastMessageText;

  //check if the chat to display has new content to be visualized
  if (!viewed) {
    setChatItemAsUnread(friendChatItemElement);
  }
}

//hide one chat
function hideOneChat(chat) {
  chat.parentElement.removeChild(chat);
}

//display all chats
function displayChatList(chatList) {
  for (const chat of chatList) {
    //If we failed to load a chat (messages or friends names)
    if (chat.errorList.length) {
      //error message on friends list
      hideFriendsListErrorInfo();
      displayFriendsListErrorInfo(
        "Sorryabout that. Failed to load some chats..."
      );
      //skip to next received chat
      continue;
    }

    //Create a new friend chat item and display it
    displayOneChat(
      chat.roomId,
      chat.friendsNames,
      false,
      "append",
      chat.viewed,
      getChatGlobalLastMessageText(chat)
    );

    //update new messages counter
    if (!chat.viewed) {
      updateNewMessagesCount("increment");
    }
  }
}

//clean all chats
function cleanChatList() {
  friendsSectionElement.querySelector("ul").textContent = "";
}

//select one chat
function selectOneChat(event) {
  //init item which will be selected
  let selectedFriendChatItemElement;

  if (event) {
    if (event.target.classList.contains("friend-chat-item")) {
      selectedFriendChatItemElement = event.target;
    } else {
      //an child of list item was clicked, therefor find list item recursivly
      selectedFriendChatItemElement = event.target.parentElement;
      let iterationCount = 0;
      while (
        !selectedFriendChatItemElement.classList.contains("friend-chat-item") &&
        iterationCount < 20 //max iterations allowed to avoid infinite loop
      ) {
        selectedFriendChatItemElement =
          selectedFriendChatItemElement.parentElement;
        iterationCount++;
      }
      //too many iterations: list item was not found
      if (iterationCount >= 20) {
        throw new Error("Could not find the selectedFriendChatItemElement");
      }
    }
  } else {
    //if this function is called manually (not by a click event), just select the first chat item in the friends list
    selectedFriendChatItemElement =
      friendsSectionElement.querySelector("ul li");
  }

  //gather selected chat item data
  const selectedFriendNameElement =
    selectedFriendChatItemElement.querySelector(".friend-chat-name");
  const selectedRoomId = selectedFriendChatItemElement.dataset.roomId;
  const selectedChatStatusElement = selectedFriendChatItemElement.querySelector(
    ".friend-chat-status"
  );

  //corresponding chat in global list
  const chatGlobal = getChatGlobalByRoomId(selectedRoomId);

  //check if this chat list item is marked as UN-read
  if (
    selectedFriendChatItemElement.classList.contains("friend-chat-item-unread")
  ) {
    //remove un-read chat item status if present
    setChatItemAsRead(selectedFriendChatItemElement);
    if (!chatGlobal.viewed) {
      updateNewMessagesCount("decrement");
    }
    chatGlobal.viewed = true;
    //tell the server this user is viewing this chat
    registerOneChatView(selectedRoomId);
  }

  //if already selected, stop!
  if (
    selectedFriendChatItemElement.classList.contains(
      "friend-chat-item-selected"
    )
  ) {
    if (window.innerWidth < 768) {
      hideFriendsSection();
      displayChatSection();
      scrollToBottomOfMessagesList("auto");
      return;
    }
  }

  //remove selection from previous selected chat item
  if (selectedChatItemGlobal) {
    selectedChatItemGlobal.classList.remove("friend-chat-item-selected");
  }
  //not already selected, then select li item
  selectedFriendChatItemElement.classList.add("friend-chat-item-selected");
  //memory for selected chat item
  selectedChatItemGlobal = selectedFriendChatItemElement;

  //reset "is typing" info and timer
  hideIsTypingInfo();
  clearTimeout(isTypingTimerId_receive);
  isTypingTimerId_receive = null;
  clearTimeout(isTypingTimerId_send);
  isTypingTimerId_send = null;
  isTypingTimerActive_receive = false;
  isTypingTimerActive_send = false;

  //copy the selected friend name, chat online status and id in the active friends section
  setActiveChatRoomId(selectedRoomId);
  setActiveFriendName(selectedFriendNameElement.textContent);
  setActiveChatOnlineStatus(selectedChatStatusElement);

  //display all messages for this chat
  displayAllMessages(chatGlobal.messages, "auto");

  //in mobile view, show only chat section
  if (window.innerWidth < 768) {
    hideFriendsSection();
    displayChatSection();
  } else {
    // >= 768
    displayFriendsSection();
    displayChatSection();
  }

  //scroll to bottom messages lists
  scrollToBottomOfMessagesList("auto");

  //UPDATE the message preview
  const messagePreviewTextElement = selectedFriendChatItemElement.querySelector(
    ".friend-chat-preview p"
  );
  messagePreviewTextElement.textContent =
    getChatGlobalLastMessageText(chatGlobal);
}

//set one chat online status
function setOneChatOnlineStatus(chat, isOnline) {
  const friendChatStatusElement = chat.querySelector(".friend-chat-status");
  if (!friendChatStatusElement) {
    return;
  }
  if (isOnline) {
    friendChatStatusElement.classList.add("friend-chat-status-online");
    friendChatStatusElement.classList.remove("friend-chat-status-offline");
  } else {
    friendChatStatusElement.classList.add("friend-chat-status-offline");
    friendChatStatusElement.classList.remove("friend-chat-status-online");
  }
  //if this element is also selected, then update accordlingly active chat online status as well
  if (chat.classList.contains("friend-chat-item-selected")) {
    setActiveChatOnlineStatus(friendChatStatusElement);
  }
  return;
}

//display invitaion link
function displayInvitationLink(linkText) {
  const invitationLinkContainerElement = document.createElement("div");
  invitationLinkContainerElement.classList.add("invitation-link");
  const invitationLinkInputElement = document.createElement("input");
  const invitationLinkActionsContainerElement = document.createElement("div");
  invitationLinkActionsContainerElement.classList.add(
    "invitation-link-actions"
  );
  const shareLinkButtonElement = document.createElement("button");
  const hideInvitationLinkButtonElement = document.createElement("button");

  //link input
  invitationLinkInputElement.type = "text";
  invitationLinkInputElement.readOnly = true;
  if (linkText) {
    invitationLinkInputElement.value = linkText;
  } else {
    invitationLinkInputElement.value = "https://linkforyourfriend";
  }
  lastGeneratedInvitationLinkGlobal = invitationLinkInputElement.value;

  //share link button
  shareLinkButtonElement.innerHTML = htmlContentShareLinkButtonIcon;
  shareLinkButtonElement.classList.add("invitation-link-share-btn");
  shareLinkButtonElement.addEventListener("click", sgareInvitationLink);

  //button for closing the link
  hideInvitationLinkButtonElement.textContent = "x";
  hideInvitationLinkButtonElement.classList.add("invitation-link-close-btn");
  hideInvitationLinkButtonElement.addEventListener("click", hideInvitationLink);

  //append content
  invitationLinkContainerElement.append(invitationLinkInputElement);
  invitationLinkActionsContainerElement.append(shareLinkButtonElement);
  invitationLinkActionsContainerElement.append(hideInvitationLinkButtonElement);
  invitationLinkContainerElement.append(invitationLinkActionsContainerElement);

  friendsSectionElement
    .querySelector(".friends-control")
    .append(invitationLinkContainerElement);
}

//hide invitation link
function hideInvitationLink() {
  const invitationLinkElement = friendsSectionElement.querySelector(
    ".friends-control .invitation-link"
  );
  if (invitationLinkElement) {
    invitationLinkElement.parentElement.removeChild(invitationLinkElement);
  }
}

//this function executes when clicking share button
async function sgareInvitationLink(event) {
  //data to be shared
  const shareData = {
    url: lastGeneratedInvitationLinkGlobal,
  };

  //invoke native sharing mechanism of the device
  try {
    await navigator.share(shareData);
  } catch (error) {
    //??
  }
}

//set counter of new messages
function updateNewMessagesCount(action) {
  //actual count
  const newMessagesCountElement = friendsSectionElement.querySelector(
    ".friends-control .new-messages-count"
  );

  //increment or decrement
  if (action === "increment") {
    // (+ 1)
    newMessagesCountElement.textContent = (
      +newMessagesCountElement.textContent + 1
    ).toString();
  } else if (action === "decrement") {
    if (!+newMessagesCountElement.textContent) {
      //if count = 0 should not decrement further
      return;
    }
    // (- 1)
    newMessagesCountElement.textContent = (
      +newMessagesCountElement.textContent - 1
    ).toString();
  }

  //update notification in the window title
  const documentTitle = document.querySelector("title");
  if (+newMessagesCountElement.textContent) {
    documentTitle.textContent = `(${newMessagesCountElement.textContent}) Live Chat`;
  } else {
    documentTitle.textContent = "Live Chat";
  }
}

//mark a friend chat item as UNread
function setChatItemAsUnread(chat) {
  //set unread
  chat.classList.add("friend-chat-item-unread");
}

//mark a friend chat item as Read
function setChatItemAsRead(chat) {
  //remove unread
  chat.classList.remove("friend-chat-item-unread");
}

//get a pointer to a chat with a specific roomId in the chatListGlobal array
function getChatGlobalByRoomId(roomId) {
  for (const chat of chatListGlobal) {
    if (chat.roomId === roomId) {
      return chat;
    }
  }
}

//get a pointer to a specific list item representing a chat
function getChatItemByRoomId(roomId) {
  const friendChatItems =
    friendsSectionElement.querySelectorAll(".friend-chat-item");
  for (const chat of friendChatItems) {
    if (chat.dataset.roomId === roomId) {
      return chat;
    }
  }
}
