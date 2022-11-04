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
  //scroll distance to bottom
  const scrollDistanceToBottom = Math.abs(
    messagesListElement.scrollTop +
      messagesListElement.clientHeight -
      messagesListElement.scrollHeight
  );

  //make sure to re-enable icon display when scroll is at bottom
  if (scrollDistanceToBottom < 5) {
    disableDisplayOfScrollToBottomButton = false;
  }

  //detect when N pixels are left to bottom scroll position
  const showIconCondition = scrollDistanceToBottom > 50; //px
  if (!showIconCondition) {
    hideScrollToBottomIcon(messagesListElement);
    return;
  }

  //check if icons should not be displaued
  if (disableDisplayOfScrollToBottomButton) {
    return;
  }

  //i a button is already present and is animated, we keep the animation
  let isAnimated;
  const iconContainerElement = messagesListElement.querySelector(
    ".scroll-to-bottom-btn"
  );
  if (iconContainerElement) {
    isAnimated = iconContainerElement.classList.contains(
      "scroll-to-bottom-btn-animate"
    );
  } else {
    isAnimated = false;
  }

  //delete icon if it is already visible
  hideScrollToBottomIcon(messagesListElement);

  //display button
  displayScrollToBottomIcon(messagesListElement, isAnimated);
}

//display scroll to bottom icon
function displayScrollToBottomIcon(messagesListElement, isAnimated) {
  //create scroll to bottom button button
  const iconContainerElement = document.createElement("div");
  iconContainerElement.innerHTML = htmlContentScrollToBottomIcon;
  iconContainerElement.classList.add("scroll-to-bottom-btn");

  //should be animted?
  if (isAnimated) {
    iconContainerElement.classList.add("scroll-to-bottom-btn-animate");
  }

  //button click event
  iconContainerElement.addEventListener("click", function (event) {
    scrollToBottomOfMessagesList("smooth");
    // messagesListElement.removeChild(iconContainerElement);
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

//create a general purpose loader
function createOneLoader(id) {
  const loaderElement = document.createElement("div");
  loaderElement.classList.add("loader");
  loaderElement.id = id;
  return loaderElement;
}

//create and display the main page loader
function displayMainLoader() {
  const loaderElement = createOneLoader("main-loader");
  document.querySelector("main").append(loaderElement);
}

//remove a specific loader in the page
function hideOneLoader(id) {
  const loaderElement = document.getElementById(id);
  if (loaderElement) {
    loaderElement.parentElement.removeChild(loaderElement);
  }
}

//display sign up/in form loader
function displaySignUpInFormLoader() {
  const loaderElement = createOneLoader("sign-up-in-form-loader");
  const formElement = signUpInSectionElement.querySelector("form");
  if (formElement) {
    formElement.appendChild(loaderElement);
  }
}

//display add new friend/chat loader
function displayAddFriendLoader() {
  const loaderElement = createOneLoader("add-friend-loader");
  const addFriendButtonElement = friendsSectionElement.querySelector(
    ".friends-control .add-friend-btn"
  );
  addFriendButtonElement.appendChild(loaderElement);
}

//display delete message loader
function displayModalLoader() {
  const loaderElement = createOneLoader("modal-loader");
  const modalPromptElement = modalSectionElement.querySelector(".modal-prompt");
  modalPromptElement.appendChild(loaderElement);
}

//display init info loader
function displayInitInfoLoader() {
  const loaderElement = createOneLoader("init-info-loader");
  const initInfoElement = initInfoSectionElement.querySelector(".init-info");
  initInfoElement.appendChild(loaderElement);
}

//display messages loader
function displayMessagesLoader() {
  const loaderElement = createOneLoader("messages-loader");
  chatSectionElement.querySelector("ul").appendChild(loaderElement);
}
