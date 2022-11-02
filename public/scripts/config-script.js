//display init info
function disaplayInitInfo(title, info, action, optionalAction) {
  if (!info) {
    return;
  }

  initInfoSectionElement.style.display = "block";
  initInfoSectionElement.innerHTML = getHtmlContentInitInfo(
    title,
    info,
    action,
    optionalAction
  );
}

// hide init info
function hideInitInfo() {
  initInfoSectionElement.textContent = "";
  initInfoSectionElement.style.display = "none";
}

//display sign up/in form
function displaySignUpInForm(action) {
  hideSignUpInForm();

  //the form to be creating can only be used for logging in or signin up
  if (action !== "Login" && action !== "Signup") {
    return;
  }

  let alternativeAction;
  if (action === "Login") {
    alternativeAction = "Signup";
  } else if (action === "Signup") {
    alternativeAction = "Login";
  }

  //create and display the form
  signUpInSectionElement.style.display = "block";
  signUpInSectionElement.innerHTML = getHtmlContentSignUpInForm(
    action,
    alternativeAction
  );
  let authenticationProcess;
  if (action === "Login") {
    authenticationProcess = login;
  } else if (action === "Signup") {
    authenticationProcess = signup;
  }
  signUpInSectionElement
    .querySelector("form")
    .addEventListener("submit", authenticationProcess);
}

//hide sign up/in form
function hideSignUpInForm() {
  signUpInSectionElement.textContent = "";
  signUpInSectionElement.style.display = "none";
}

//display friends section on desktop
function displayFriendsAndChatSectionOnWidhtChange(event) {
  //only if auth form and init info are not visible, it is possible to
  //manipulate the visibility of
  const isALlowed =
    (signUpInSectionElement.style.display === "none" ||
      signUpInSectionElement.textContent === "") &&
    (initInfoSectionElement.style.display === "none" ||
      initInfoSectionElement.textContent === "") &&
    !document.getElementById("main-loader");

  if (!isALlowed) {
    return;
  }

  //window >= 768px
  if (window.innerWidth >= 768) {
    if (selectedChatItemGlobal) {
      displayFriendsSection();
      displayChatSection();
    }
  } else {
    if (
      friendsSectionElement.style.display === "block" &&
      chatSectionElement.style.display === "none"
    ) {
      displayFriendsSection();
      hideChatSection();
    } else if (
      friendsSectionElement.style.display === "none" &&
      chatSectionElement.style.display === "flex"
    ) {
      hideFriendsSection();
      displayChatSection();
    } else if (
      friendsSectionElement.style.display === "block" &&
      chatSectionElement.style.display === "flex"
    ) {
      if (selectedChatItemGlobal) {
        hideFriendsSection();
        displayChatSection();
      } else {
        displayFriendsSection();
        hideChatSection();
      }
    }
  }

  //mark selected chat item as read when screen gets bigger
  if (window.innerWidth >= 768 && selectedChatItemGlobal) {
    if (selectedChatItemGlobal.classList.contains("friend-chat-item-unread")) {
      setChatItemAsRead(selectedChatItemGlobal);
      const chatGlobal = getChatGlobalByRoomId(
        selectedChatItemGlobal.dataset.roomId
      );
      if (!chatGlobal.viewed) {
        updateNewMessagesCount("decrement");
      }
      chatGlobal.viewed = true;
      //tell the server the user is viewing new content for this chat
      registerOneChatView(selectedChatItemGlobal.dataset.roomId);
      scrollToBottomOfMessagesList("auto");
    }
  }
}

//display active friends and form
function displayActiveFriendsAndForm() {
  chatSectionElement.querySelector(".active-friends").style.display = "flex";
  chatSectionElement.querySelector(".chat-actions").style.display = "flex";
}

//display active friends and form
function hideActiveFriendsAndForm() {
  chatSectionElement.querySelector(".active-friends").style.display = "none";
  chatSectionElement.querySelector(".chat-actions").style.display = "none";
}

//scroll to the bottom of the chat list
function scrollToBottomOfMessagesList(scrollBehavior) {
  const messagesListElement = chatSectionElement.querySelector("ul");
  messagesListElement.scrollTo({
    top: messagesListElement.scrollHeight,
    left: 0,
    behavior: scrollBehavior,
  });
}

//when scrolling the chat messages list,
function onMessagesListScroll(event) {
  //scrolled element
  const messagesListElement = event.target;

  //logic for displaying/hide "scroll to bottom" icon
  handleScrollToBottomIconVisibility(messagesListElement);

  //if we scrolled to top, request to load more messages
  const isMessagesListAtTop = !messagesListElement.scrollTop;
  if (!isMessagesListAtTop) {
    return;
  }

  //if there are no messages in the list, stop
  //NODE: this is needed to prevent, when selecting a new chat, from sending right a way the request below. This
  //happens because when selecting a new chat, the current chat list elements is emptied, causing UL element to scroll to top.
  const isMessagesListEmpty = !messagesListElement.children.length;
  if (isMessagesListEmpty) {
    return;
  }

  //request to load more messages
  loadMoreMessages();
}

//display/hide scroll to bottom icon
function handleScrollToBottomIconVisibility(messagesListElement) {
  //scroll coordinates
  const currentScrollHeight =
    messagesListElement.scrollTop + messagesListElement.clientHeight;
  const maxScrollHeight = messagesListElement.scrollHeight;

  //detect when N pixels are left to bottom scroll position
  const showIconCondition = maxScrollHeight - currentScrollHeight > 200; //px
  if (!showIconCondition) {
    hideScrollToBottomIcon(messagesListElement);
    return;
  }

  //if scroll to button button exists already, do not create a new on
  if (messagesListElement.querySelector(".scroll-to-bottom-btn")) {
    return;
  }

  //create scroll to bottom button button
  const iconContainerElement = document.createElement("div");
  iconContainerElement.innerHTML = htmlContentScrollToBottomIcon;
  iconContainerElement.classList.add("scroll-to-bottom-btn");

  //button click event
  iconContainerElement.addEventListener("click", function (event) {
    messagesListElement.scrollTop = messagesListElement.scrollHeight;
    messagesListElement.removeChild(iconContainerElement);
  });

  //insert the button inside the list element
  messagesListElement.appendChild(iconContainerElement);
}

//hide scroll to bottom icon
function hideScrollToBottomIcon(messagesListElement) {
  const iconContainer = messagesListElement.querySelector(
    ".scroll-to-bottom-btn"
  );
  if (iconContainer) {
    messagesListElement.removeChild(iconContainer);
  }
}

//hide friends section
function hideFriendsSection() {
  friendsSectionElement.style.display = "none";
}

//display friends section
function displayFriendsSection() {
  //show this section
  friendsSectionElement.style.display = "block";
}

//display chat section
function displayChatSection() {
  chatSectionElement.style.display = "flex";
}

//hide chat section
function hideChatSection() {
  chatSectionElement.style.display = "none";
}

//display the friends list and hide chat
function displayFriendsAndHideChat() {
  displayFriendsSection();
  hideChatSection();
}

//display message actions menu
function displayMessageActions(event) {
  //find message to which this action is related
  let selectedMessageItem = event.target;

  //check which element was exactly clicked
  //an child of list item was clicked, therefor find list item recursivly
  let iterationCount = 0;
  while (
    !selectedMessageItem.classList.contains("message-item") &&
    iterationCount < 20 //max iterations allowed to avoid infinite loop
  ) {
    selectedMessageItem = selectedMessageItem.parentElement;
    iterationCount++;
  }
  //too many iterations: list item was not found
  if (iterationCount >= 20) {
    throw new Error("Could not find the selectedMessageItem");
  }

  //selected message id
  selectedMessageIdGlobal = selectedMessageItem.dataset.messageId;

  //display actual message action menu
  hideAllMessagesActions();

  const messageMenuElement = document.createElement("div");
  messageMenuElement.classList.add("message-item-action-menu");

  const messageMenuActionElement = document.createElement("button");
  messageMenuActionElement.textContent = "Delete";
  messageMenuActionElement.classList.add("message-item-delete-btn");
  messageMenuActionElement.addEventListener("click", displayDeleteMessageModal);

  messageMenuElement.append(messageMenuActionElement);
  selectedMessageItem.querySelector("p").append(messageMenuElement);
}

//hide message actions menu
function hideMessageActions(messageItemElement) {
  const messageMenuElement = messageItemElement.querySelector(
    ".message-item-action-menu"
  );
  if (messageMenuElement) {
    messageMenuElement.parentElement.removeChild(messageMenuElement);
  }
}

//hide menus by clicking anywhere in the chat a part from the message menu
function hideAllMessagesActions(event) {
  if (event) {
    const clickedElement = event.target;

    if (!clickedElement) {
      return;
    }

    if (
      clickedElement.classList.contains("message-item-action-menu") ||
      clickedElement.classList.contains("message-item-delete-btn") ||
      clickedElement.classList.contains("message-item-action") ||
      clickedElement.tagName === "svg" ||
      clickedElement.tagName === "path"
    ) {
      return;
    }
  }

  //gather all menus and remove them
  const messageMenuElements = document.querySelectorAll(
    ".message-item-action-menu"
  );
  for (const messageMenu of messageMenuElements) {
    messageMenu.parentElement.removeChild(messageMenu);
  }
}

//display modal
function displayDeleteMessageModal(event) {
  //hide menu in which button was clicked
  const messageMenuElement = event.target.parentElement;
  if (!messageMenuElement.classList.contains("message-item-action-menu")) {
    return;
  }
  messageMenuElement.parentElement.removeChild(messageMenuElement);

  //create and display actual modal
  modalSectionElement.innerHTML = getHmlContentModal("delete-message");
}

//hide modal
function hideModal(event) {
  const modalContainerElement = modalSectionElement.querySelector(".modal");
  modalSectionElement.removeChild(modalContainerElement);
}

//create and display the main page loader
function displayMainLoader() {
  const loaderElement = document.createElement("div");
  loaderElement.classList.add("loader");
  loaderElement.id = "main-loader";
  document.querySelector("main").append(loaderElement);
}

//remove the main page loader
function hideMainLoader() {
  const loaderElement = document.getElementById("main-loader");
  if (loaderElement) {
    loaderElement.parentElement.removeChild(loaderElement);
  }
}

//set user name
function setUserName(name) {
  const userNameElement = friendsSectionElement.querySelector(
    ".friends-control .user-name"
  );
  userNameElement.textContent = name;
}
