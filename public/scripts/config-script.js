//create a todo inside a new list element
function displayOneTodo(todoText, todoId) {
  //create list item element
  const todoLiElement = document.createElement("li");
  todoLiElement.dataset.todoId = todoId;

  //create one DIV for the input
  const todoInputDivElement = document.createElement("div");
  todoInputDivElement.classList.add("todo-input");

  //create one DIV for the buttons
  const todoButtonsDivElement = document.createElement("div");
  todoButtonsDivElement.classList.add("todo-buttons");

  //create an input with the todo text to be appended in the list item
  const todoInputElement = document.createElement("input");
  todoInputElement.value = todoText;
  todoInputDivElement.appendChild(todoInputElement);
  todoLiElement.appendChild(todoInputDivElement);

  //create and append update button in the list item
  const todoUpdateButton = document.createElement("button");
  todoUpdateButton.textContent = "Update";
  todoUpdateButton.classList.add("todo-update-btn");
  todoUpdateButton.dataset.todoId = todoId;
  todoUpdateButton.addEventListener("click", updateTodo);
  todoButtonsDivElement.appendChild(todoUpdateButton);

  //create and append delete button in the list item
  const todoDeleteButton = document.createElement("button");
  todoDeleteButton.textContent = "Delete";
  todoDeleteButton.classList.add("todo-delete-btn");
  todoDeleteButton.dataset.todoId = todoId;
  todoDeleteButton.addEventListener("click", deleteTodo);
  todoButtonsDivElement.appendChild(todoDeleteButton);

  //append second div
  todoLiElement.appendChild(todoButtonsDivElement);

  //append the li item inside the todos list
  todosElement.appendChild(todoLiElement);
}

//display array of todos received on the socket
function displayAllTodos(todos) {
  for (const todo of todos) {
    displayOneTodo(todo.todoText, todo._id);
  }
}

//clean all todos
function cleanAllTodos() {
  todosElement.textContent = "";
}

//delete a todo
function hideOneTodo(todoId) {
  const allTodos = todosElement.querySelectorAll("li");
  for (const liItem of allTodos) {
    if (liItem.dataset.todoId === todoId) {
      todosElement.removeChild(liItem);
      return;
    }
  }
}

//set todo id on the page
function setTodoId(todoId) {
  const allTodos = todosElement.querySelectorAll("li");
  for (const liItem of allTodos) {
    if (liItem.dataset.todoId === "not-confirmed") {
      liItem.dataset.todoId = todoId;
      liItem.querySelector(".todo-update-btn").dataset.todoId = todoId;
      liItem.querySelector(".todo-delete-btn").dataset.todoId = todoId;
      return;
    }
  }
}

//set todo input
function setTodoInput(todoId, todoText) {
  const allTodos = todosElement.querySelectorAll("li");
  for (const liItem of allTodos) {
    if (liItem.dataset.todoId === todoId) {
      liItem.querySelector("input").value = todoText;
      return;
    }
  }
}

//hide error message
function hideErrorMessage() {
  const errorMessage = document.getElementById("error-message");
  if (errorMessage) {
    errorMessage.parentElement.removeChild(errorMessage);
  }
}

//display error message
function displayErrorMessage(message) {
  hideErrorMessage();
  const errorMessageElement = document.createElement("p");
  errorMessageElement.textContent = message;
  errorMessageElement.id = "error-message";
  document.getElementById("info-section").appendChild(errorMessageElement);
}
