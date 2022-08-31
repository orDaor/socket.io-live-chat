//emit a todo on the websocket connection
function createTodo(event) {
  ////user not connected...
  event.preventDefault();
  if (!socket.connected) {
    displayErrorMessage("You are not connected!");
    return;
  }

  //user connected...
  const todoText = formInputElement.value;
  if (todoText.trim()) {
    hideErrorMessage();
    displayOneTodo(todoText, "not-confirmed");
    //send (emit) a event with a todo to the server
    socket.emit("todo-create", todoText, onTodoCreateAck); //we can pass any data that can be encoded as JSON
    formInputElement.value = "";
  }
}

//read all todos: emit an emty event asking the server to send back an array of the todos
function readTodo() {
  //user not connected...
  if (!socket.connected) {
    displayErrorMessage("You are not connected!");
    return;
  }

  ////user connected...
  socket.emit("todo-read", {}, onTodoReadAck);
}

//update a todo: emit a an event containing the todo id with the new text
function updateTodo(event) {
  //user not connected...
  if (!socket.connected) {
    displayErrorMessage("You are not connected!");
    return;
  }

  //user connected...
  const updateButtonElement = event.target;
  const todoId = updateButtonElement.dataset.todoId;
  const thisListItemElement = updateButtonElement.parentElement.parentElement;
  const inputValue = thisListItemElement.querySelector("input").value;
  socket.emit(
    "todo-update",
    { todoText: inputValue, id: todoId },
    onTodoUpdateAck
  );
}

//delete a todo: emit event containing id of th todo to delete
function deleteTodo(event) {
  //user not connected...
  event.preventDefault();
  if (!socket.connected) {
    displayErrorMessage("You are not connected!");
    return;
  }

  //user connected...
  const updateButtonElement = event.target;
  const todoId = updateButtonElement.dataset.todoId;
  socket.emit("todo-delete", todoId, onTodoDeleteAck);
}
