const htmlContentEditMessageIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
<path
  fill = "#000000"
  d="M10 16q-.625 0-1.062-.438Q8.5 15.125 8.5 14.5t.438-1.062Q9.375 13 10 13t1.062.438q.438.437.438 1.062t-.438 1.062Q10.625 16 10 16Zm0-4.5q-.625 0-1.062-.438Q8.5 10.625 8.5 10t.438-1.062Q9.375 8.5 10 8.5t1.062.438q.438.437.438 1.062t-.438 1.062q-.437.438-1.062.438ZM10 7q-.625 0-1.062-.438Q8.5 6.125 8.5 5.5t.438-1.062Q9.375 4 10 4t1.062.438q.438.437.438 1.062t-.438 1.062Q10.625 7 10 7Z"
/>
</svg>`;

function getHtmlContentSignUpInForm(action) {
  return `<form>
  <p>
    <label for="Nickname">Name</label>
    <input type="text" id="username" name="username" required>
  </p>
  <p>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required>
  </p>
  <button>${action}</button>
  </form>`;
}
