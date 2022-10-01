//set active room id
function setActiveChatRoomId(roomId) {
  chatSectionElement.querySelector(".active-friends").dataset.roomId = roomId;
}

//set active friend name
function setActiveFriendName(activeFriendName) {
  const activeFriendNameElement = chatSectionElement.querySelector(
    ".active-friends .friend-chat-name"
  );
  activeFriendNameElement.textContent = activeFriendName;
}

//set active chat online status
function setActiveChatOnlineStatus(selectedChatStatusElement) {
  const activeChatStatus = chatSectionElement.querySelector(
    ".active-friends .friend-chat-status"
  );
  if (
    selectedChatStatusElement.classList.contains("friend-chat-status-online")
  ) {
    activeChatStatus.classList.add("friend-chat-status-online");
    activeChatStatus.classList.remove("friend-chat-status-offline");
  } else if (
    selectedChatStatusElement.classList.contains("friend-chat-status-offline")
  ) {
    activeChatStatus.classList.add("friend-chat-status-offline");
    activeChatStatus.classList.remove("friend-chat-status-online");
  }
}

//display one chat
function displayOneChat(roomId, friendsNames, isOnline) {
  const friendChatItemContainerElement = document.createElement("div");
  friendChatItemContainerElement.classList.add("friend-chat-main-info");
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

  //append content
  friendChatItemContainerElement.appendChild(chatOnlineStatus);
  friendChatItemContainerElement.appendChild(friendNameElement);
  friendChatItemElement.appendChild(friendChatItemContainerElement);
  friendsSectionElement.querySelector("ul").appendChild(friendChatItemElement);
}

//hide one chat
function hideOneChat(roomId) {
  const chatList = document.querySelectorAll(".friend-chat-item");
  for (const chat of chatList) {
    if (chat.dataset.roomId === roomId) {
      chat.parentElement.removeChild(chat);
      return;
    }
  }
}

//display all chats
function displayChatList(chatList) {
  for (const chat of chatList) {
    displayOneChat(chat.roomId, chat.friendsNames); //TODO: pass isOnline parameter
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
        iterationCount < 20 //max iterations allowed to avoid infinite loos
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

  //select li item
  selectedFriendChatItemElement.classList.add("friend-chat-item-selected");

  //gather selected chat item data
  const selectedFriendNameElement =
    selectedFriendChatItemElement.querySelector(".friend-chat-name");
  const selectedRoomId = selectedFriendChatItemElement.dataset.roomId;
  const selectedChatStatusElement = selectedFriendChatItemElement.querySelector(
    ".friend-chat-status"
  );

  //copy the selected friend name, chat online status and id in the active friends section
  setActiveChatRoomId(selectedRoomId);
  setActiveFriendName(selectedFriendNameElement.textContent);
  setActiveChatOnlineStatus(selectedChatStatusElement);

  //remove selected style from other chats in the list
  const chatList = document.querySelectorAll(".friend-chat-item");
  for (const chat of chatList) {
    if (chat.dataset.roomId !== selectedroomId) {
      chat.classList.remove("friend-chat-item-selected");
    }
  }

  //remove un-read chat item status if present
  setChatItemAsRead(selectedRoomId);

  //in mobile view, show only chat section
  if (window.innerWidth < 768) {
    hideFriendsSection();
    displayChatSection();
  }
}

//set one chat online status
function setOneChatOnlineStatus(roomId, isOnline) {
  const chatList = document.querySelectorAll(".friend-chat-item");
  for (const chat of chatList) {
    if (chat.dataset.roomId === roomId) {
      const friendChatStatusElement = chat.querySelector(".friend-chat-status");
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
  }
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

  //share link button
  shareLinkButtonElement.textContent = "Share";

  //button for closing the link
  hideInvitationLinkButtonElement.textContent = "x";
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

//set counter of new messages
function setNewMessagesCount(count) {
  const newMessagesCount = friendsSectionElement.querySelector(
    ".friends-control .new-messages-count"
  );
  newMessagesCount.textContent = count;
}

//mark a friend chat item as UNread
function setChatItemAsUnread(roomId) {
  const chatList = document.querySelectorAll(".friend-chat-item");
  for (const chat of chatList) {
    if (chat.dataset.roomId === roomId) {
      //set unread
      chat.classList.add("friend-chat-item-unread");
      //add unread noty
      const unreadNoty = document.createElement("div");
      unreadNoty.classList.add("friend-chat-noty");
      unreadNoty.textContent = "(!)";
      chat.appendChild(unreadNoty);
      return;
    }
  }
}

//mark a friend chat item as Read
function setChatItemAsRead(roomId) {
  const chatList = document.querySelectorAll(".friend-chat-item");
  for (const chat of chatList) {
    if (chat.dataset.roomId === roomId) {
      //remove unread
      chat.classList.remove("friend-chat-item-unread");
      //remove unread noty
      const unreadNoty = chat.querySelector(".friend-chat-noty");
      if (unreadNoty) {
        chat.removeChild(unreadNoty);
      }
      return;
    }
  }
}
