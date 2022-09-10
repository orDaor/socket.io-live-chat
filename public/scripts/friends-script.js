//set active friend id
function setActiveFriendId(friendId) {
  chatSectionElement.querySelector(".active-friends").dataset.friendId =
    friendId;
}

//set active friend name
function setActiveFriendName(activeFriendName) {
  const activeFriendNameElement = chatSectionElement.querySelector(
    ".active-friends .friend-chat-name"
  );
  activeFriendNameElement.textContent = activeFriendName;
}

//set active friend online status
function setActiveFriendOnlineStatus(selectedFriendStatusElement) {
  const activeFriendStatus = chatSectionElement.querySelector(
    ".active-friends .friend-chat-status"
  );
  if (
    selectedFriendStatusElement.classList.contains("friend-chat-status-online")
  ) {
    activeFriendStatus.classList.add("friend-chat-status-online");
    activeFriendStatus.classList.remove("friend-chat-status-offline");
  } else if (
    selectedFriendStatusElement.classList.contains("friend-chat-status-offline")
  ) {
    activeFriendStatus.classList.add("friend-chat-status-offline");
    activeFriendStatus.classList.remove("friend-chat-status-online");
  }
}

//display one friend
function displayOneFriend(friend, isOnline) {
  const friendChatItemContainerElement = document.createElement("div");
  friendChatItemContainerElement.classList.add("friend-chat-main-info");
  const friendChatItemElement = document.createElement("li");
  friendChatItemElement.classList.add("friend-chat-item"); // to be checked !!
  friendChatItemElement.dataset.friendId = friend.friendId;
  friendChatItemElement.addEventListener("click", selectOneFriend);

  //online status of the friend
  const friendOnlineStatus = document.createElement("p");
  friendOnlineStatus.classList.add("friend-chat-status");
  if (isOnline) {
    friendOnlineStatus.classList.add("friend-chat-status-online");
    friendOnlineStatus.classList.remove("friend-chat-status-offline");
  } else {
    friendOnlineStatus.classList.add("friend-chat-status-offline");
    friendOnlineStatus.classList.remove("friend-chat-status-online");
  }

  //friend name
  const friendNameElement = document.createElement("p");
  friendNameElement.textContent = friend.name; // to be checked !!
  friendNameElement.classList.add("friend-chat-name");

  //append content
  friendChatItemContainerElement.appendChild(friendOnlineStatus);
  friendChatItemContainerElement.appendChild(friendNameElement);
  friendChatItemElement.appendChild(friendChatItemContainerElement);
  friendsSectionElement.querySelector("ul").appendChild(friendChatItemElement);
}

//hide one friend
function hideOneFriend(friendId) {
  const friends = document.querySelectorAll(".friend-chat-item");
  for (const friend of friends) {
    if (friend.dataset.friendId === friendId) {
      friend.parentElement.removeChild(friend);
      return;
    }
  }
}

//display all friends
function displayAllFriends(friends) {
  for (const friend of friends) {
    displayOneFriend(friend);
  }
}

//select one frand to chat with
function selectOneFriend(event) {
  //find list item on which click occured
  let selectedFriendChatItemElement;
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

  //select li item
  selectedFriendChatItemElement.classList.add("friend-chat-item-selected");

  //gather selected friend item data
  const selectedFriendNameElement =
    selectedFriendChatItemElement.querySelector(".friend-chat-name");
  const selectedFriendId = selectedFriendChatItemElement.dataset.friendId;
  const selectedFriendStatusElement =
    selectedFriendChatItemElement.querySelector(".friend-chat-status");

  //copy the selected friend name, online status and id in the active friend section
  setActiveFriendId(selectedFriendId);

  setActiveFriendName(selectedFriendNameElement.textContent);

  setActiveFriendOnlineStatus(selectedFriendStatusElement);

  //remove selected style from other friends in the list
  const friends = document.querySelectorAll(".friend-chat-item");
  for (const friend of friends) {
    if (friend.dataset.friendId !== selectedFriendId) {
      friend.classList.remove("friend-chat-item-selected");
    }
  }

  //remove un-read chat item status if present
  setChatItemAsRead(selectedFriendId);

  //in mobile view, show only chat section
  if (window.innerWidth < 768) {
    hideFriendsSection();
    displayChatSection();
  }
}

//set one friend online status
function setOneFriendOnlineStatus(friendId, isOnline) {
  const friends = document.querySelectorAll(".friend-chat-item");
  for (const friend of friends) {
    if (friend.dataset.friendId === friendId) {
      const friendChatStatusElement = friend.querySelector(
        ".friend-chat-status"
      );
      if (isOnline) {
        friendChatStatusElement.classList.add("friend-chat-status-online");
        friendChatStatusElement.classList.remove("friend-chat-status-offline");
      } else {
        friendChatStatusElement.classList.add("friend-chat-status-offline");
        friendChatStatusElement.classList.remove("friend-chat-status-online");
      }
      //if this element is also selected, then update accordlingly active friend status as well
      if (friend.classList.contains("friend-chat-item-selected")) {
        setActiveFriendOnlineStatus(friendChatStatusElement);
      }
      return;
    }
  }
}

//request a link for inviting a friend
function getInvitationLink() {
  console.log("Ask the server to give me an invitation link...");
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
function setChatItemAsUnread(friendId) {
  const friends = document.querySelectorAll(".friend-chat-item");
  for (const friend of friends) {
    if (friend.dataset.friendId === friendId) {
      //set unread
      friend.classList.add("friend-chat-item-unread");
      //add unread noty
      const unreadNoty = document.createElement("div");
      unreadNoty.classList.add("friend-chat-noty");
      unreadNoty.textContent = "(!)";
      friend.appendChild(unreadNoty);
      return;
    }
  }
}

//mark a friend chat item as Read
function setChatItemAsRead(friendId) {
  const friends = document.querySelectorAll(".friend-chat-item");
  for (const friend of friends) {
    if (friend.dataset.friendId === friendId) {
      //remove unread
      friend.classList.remove("friend-chat-item-unread");
      //remove unread noty
      const unreadNoty = friend.querySelector(".friend-chat-noty");
      if (unreadNoty) {
        friend.removeChild(unreadNoty);
      }
      return;
    }
  }
}
