//display one friend
function displayOneFriend(friend) {
  const friendChatItemElement = document.createElement("li");
  friendChatItemElement.classList.add("friend-chat-item"); // to be checked !!
  friendChatItemElement.dataset.friendId = friend.friendId;
  const friendNameElement = document.createElement("p");
  friendChatItemElement.appendChild(friendNameElement);
  friendNameElement.textContent = friend.name; // to be checked !!
  friendsSectionElement.querySelector("ul").appendChild(friendChatItemElement);
}

//hide one friend
function hideOneFriend(friendId) {
  const friends = document.querySelectorAll(".friend-chat-item");
  for (const friend of friends) {
    if (friend.dataset.friendId === friendId) {
      friend.parentElement.removeChild(friend);
    }
  }
}

//display all friends
function displayAllFriends(friends) {
  for (const friend of friends) {
    displayOneFriend(friend);
  }
}
