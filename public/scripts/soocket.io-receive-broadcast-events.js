//process broadcast notification from server on todo create event
function onTodoCreateBroadcast(broadcastNoty) {
  displayOneTodo(broadcastNoty.todoText, broadcastNoty.id);
}

//process broadcast notification from server on todo update event
function onTodoUpdateBroadcast(broadcastNoty) {
  setTodoInput(broadcastNoty.id, broadcastNoty.todoText);
}

//process broadcast notification from server on todo delete event
function onTodoDeleteBroadcast(broadcastNoty) {
  const todoId = broadcastNoty;
  hideOneTodo(todoId);
}
