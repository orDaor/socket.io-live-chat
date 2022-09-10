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
  const friendChatItemElement = document.createElement("li");
  friendChatItemElement.classList.add("friend-chat-item"); // to be checked !!
  friendChatItemElement.dataset.friendId = friend.friendId;

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
  friendChatItemElement.appendChild(friendOnlineStatus);
  friendChatItemElement.appendChild(friendNameElement);
  friendChatItemElement.addEventListener("click", selectOneFriend);

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
  const selectedFriendChatItemElement = event.target;
  let selectedFriendNameElement;
  let selectedFriendId;
  let selectedFriendStatusElement;

  //check whether the LI element was clicked or an element inside of it
  if (selectedFriendChatItemElement.tagName === "LI") {
    selectedFriendChatItemElement.classList.add("friend-chat-item-selected");
    selectedFriendNameElement =
      selectedFriendChatItemElement.querySelector(".friend-chat-name");
    selectedFriendId = selectedFriendChatItemElement.dataset.friendId;
    selectedFriendStatusElement = selectedFriendChatItemElement.querySelector(
      ".friend-chat-status"
    );
  } else {
    selectedFriendChatItemElement.parentElement.classList.add(
      "friend-chat-item-selected"
    );
    selectedFriendNameElement =
      selectedFriendChatItemElement.parentElement.querySelector(
        ".friend-chat-name"
      );
    selectedFriendId =
      selectedFriendChatItemElement.parentElement.dataset.friendId;
    selectedFriendStatusElement =
      selectedFriendChatItemElement.parentElement.querySelector(
        ".friend-chat-status"
      );
  }

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
