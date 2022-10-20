const htmlContentEditMessageIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
<path
  fill = "#000000"
  d="M10 16q-.625 0-1.062-.438Q8.5 15.125 8.5 14.5t.438-1.062Q9.375 13 10 13t1.062.438q.438.437.438 1.062t-.438 1.062Q10.625 16 10 16Zm0-4.5q-.625 0-1.062-.438Q8.5 10.625 8.5 10t.438-1.062Q9.375 8.5 10 8.5t1.062.438q.438.437.438 1.062t-.438 1.062q-.437.438-1.062.438ZM10 7q-.625 0-1.062-.438Q8.5 6.125 8.5 5.5t.438-1.062Q9.375 4 10 4t1.062.438q.438.437.438 1.062t-.438 1.062Q10.625 7 10 7Z"
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
