const todoCrudOps = require("../todos-crud-ops/todos-crud-ops");

//when a websocket connection is dropped, execute this function
function onDisconnect(reason) {
  console.log(`User disconnected because: ${reason}`);
}

//create a new todo in the DB and broadcast it to all other sockets
async function onTodoCreate(socket, todoText, sendAck) {
  let eventAck = {};
  let result = await todoCrudOps.createTodo(todoText);
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.message = "We could not save your Todo";
  } else {
    //todo created successfully
    eventAck.ok = true;
    eventAck.message = "Todo created successfully";
    eventAck.id = result.insertedId.toString();
    //broadcast the new todo to all other users
    socket.broadcast.emit("todo-create-broadcast", {
      todoText: todoText,
      id: eventAck.id,
    });
  }

  //acknowledge the todo saving request to the client
  sendAck(eventAck);
  // console.log(eventAck);
}

//read todos from DB
async function onTodoRead(socket, sendAck) {
  let eventAck = {};
  let result = await todoCrudOps.readTodo();
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.message = "We could not get your todos";
  } else {
    //todo created successfully
    eventAck.ok = true;
    eventAck.message = "Todo fetched successfully";
    eventAck.todos = result;
  }

  //acknowledge the todo saving request to the client
  sendAck(eventAck);
  // console.log(eventAck);
}

//update a todo in the DB
async function onTodoUpdate(socket, newTodoText, id, sendAck) {
  let eventAck = {};
  let result = await todoCrudOps.updateTodo(newTodoText, id);
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.message = "We could not update your todo";
  } else {
    //todo created successfully
    eventAck.ok = true;
    eventAck.message = "Todo updated successfully";
    //broadcast the updated todo to all other users
    socket.broadcast.emit("todo-update-broadcast", {
      todoText: newTodoText,
      id: id,
    });
  }

  //acknowledge the todo saving request to the client
  sendAck(eventAck);
  // console.log(eventAck);
}

//delete a todo from the DB
async function onTodoDelete(socket, id, sendAck) {
  let eventAck = {};
  let result = await todoCrudOps.deleteTodo(id);
  // result = null;
  if (!result) {
    //an error occured when saving in the DB
    eventAck.ok = false;
    eventAck.message = "We could not delete your Todo";
  } else {
    //todo created successfully
    eventAck.ok = true;
    eventAck.message = "Todo deleted successfully";
    eventAck.id = id;
    //broadcast the new todo to all other users
    socket.broadcast.emit("todo-delete-broadcast", id);
  }

  //acknowledge the todo saving request to the client
  sendAck(eventAck);
  // console.log(eventAck);
}

//exports
module.exports = {
  onDisconnect: onDisconnect,
  onTodoCreate: onTodoCreate,
  onTodoRead: onTodoRead,
  onTodoUpdate: onTodoUpdate,
  onTodoDelete: onTodoDelete,
};
