//process ack from server on todo create event
function onTodoCreateAck(eventAck) {
  //todo not saved as requested
  if (!eventAck.ok) {
    displayErrorMessage(eventAck.message);
    hideOneTodo("not-confirmed");
    return;
  }

  //response ok
  setTodoId(eventAck.id);
}

//process ack from server on todo read event
function onTodoReadAck(eventAck) {
  //clean from page all todos and error message
  hideErrorMessage();
  cleanAllTodos();

  //could not fetch the todos
  if (!eventAck.ok) {
    displayErrorMessage(eventAck.message);
    return;
  }

  //response ok
  displayAllTodos(eventAck.todos);
}

//process ack from server on todo update event
function onTodoUpdateAck(eventAck) {
  //could not update the todo
  if (!eventAck.ok) {
    displayErrorMessage(eventAck.message);
    return;
  }
}

//process ack from server on todo delete
function onTodoDeleteAck(eventAck) {
  //could not delete the todo
  if (!eventAck.ok) {
    displayErrorMessage(eventAck.message);
    return;
  }

  hideOneTodo(eventAck.id);
}
