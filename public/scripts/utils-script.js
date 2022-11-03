const htmlContentEditMessageIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
<path
  fill = "#404040"
  d="M10 16q-.625 0-1.062-.438Q8.5 15.125 8.5 14.5t.438-1.062Q9.375 13 10 13t1.062.438q.438.437.438 1.062t-.438 1.062Q10.625 16 10 16Zm0-4.5q-.625 0-1.062-.438Q8.5 10.625 8.5 10t.438-1.062Q9.375 8.5 10 8.5t1.062.438q.438.437.438 1.062t-.438 1.062q-.437.438-1.062.438ZM10 7q-.625 0-1.062-.438Q8.5 6.125 8.5 5.5t.438-1.062Q9.375 4 10 4t1.062.438q.438.437.438 1.062t-.438 1.062Q10.625 7 10 7Z"
/>
</svg>`;

const htmlContentScrollToBottomIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40">
<path
  fill = "#404040"
  d="m20 30.458-8.833-8.875 1-1L20 28.458l7.833-7.875 1 1Zm0-10.125L11.167 11.5l1-1L20 18.333l7.833-7.833 1 1Z"
/>
</svg>`;

function getHtmlContentSignUpInForm(action, alternativeAction) {
  let h1ElementTextContent;
  if (action === "Login") {
    h1ElementTextContent = "Log in with your account";
  } else if (action === "Signup") {
    h1ElementTextContent = "Create a new account";
  }

  return `<form>
  <h1>
    ${h1ElementTextContent}
  </h1>
  <p>
    <label for="Nickname">Your Name</label>
    <input type="text" id="username" name="username" required>
  </p>
  <p>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required>
  </p>
  <button class="btn">${action}</button>
  <button
    type="button" class="btn btn-alt"
    onclick="displaySignUpInForm('${alternativeAction}', '${action}')">
  ${alternativeAction}
  </button>
  </form>`;
}

function getHtmlContentInitInfo(title, info, action, optionalAction, data) {
  //optional action
  let optionalHtmlContent = "";
  if (optionalAction) {
    //accept invitation link case
    if (optionalAction === "Join Chat") {
      optionalHtmlContent = `<button class="btn" onclick="joinChat(event)">${optionalAction}</button>`;
      //other cases
    } else {
      //TODO
    }
  }

  //html content
  const htmlContent =
    `<div class="init-info">
      <h1>${title}</h1>
      <p>${info}</p>` +
    optionalHtmlContent +
    `<a href="/"><button class="btn btn-alt">${action}</button></a>` +
    `</div>`;

  return htmlContent;
}

function getHmlContentModal(action) {
  let title;
  let description;
  let onclick;
  if (action === "delete-message") {
    title = "Do you really want to delete this message?";
    description = "The message will be deleted for everyone";
    onclick = '"deleteOneMessage(event)"';
  } else if (action === "delete-chat") {
    //TODO
  } else if (action === "delete-account") {
    //TODO
  }

  return `<div class="modal">
  <div class="modal-prompt">
  <h1>${title}</h1>
  <p>${description}</p>
  <button class="btn" onclick="hideModal(event)">No</button>
  <button class="btn btn-alt" onclick=${onclick}>Yes</button>
</div>
</div>`;
}

function getCSSPropertyValue_px(element, propertyName) {
  const elementStyle = window.getComputedStyle(element);
  const propertyValue = elementStyle.getPropertyValue(propertyName);
  if (!propertyValue.includes("px")) {
    throw new Error("The requested property has not a value in pixels");
  }
  return +propertyValue.replace("px", "");
}

function getElementMargin(element, margin) {
  //margin
  let computedMargin;
  if (margin === "margin-top" || margin === "margin-bottom") {
    computedMargin = getCSSPropertyValue_px(element, margin);
  } else if (margin === "margin-full") {
    computedMargin =
      getCSSPropertyValue_px(element, "margin-top") +
      getCSSPropertyValue_px(element, "margin-bottom");
  } else {
    throw new Error("No correct margin requested");
  }
  return computedMargin;
}
