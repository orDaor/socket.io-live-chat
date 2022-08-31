//opening wfeb socket connection (by default with the server which served the page)
const socket = io();

//access DOM elements
const todosElement = document.getElementById("todos");
const formElement = document.getElementById("form");
const formInputElement = document.getElementById("form-input");
const loadTodosButtonElement = document.getElementById("load-todos-btn");

//send events to server
formElement.addEventListener("submit", createTodo);
loadTodosButtonElement.addEventListener("click", readTodo);

//on socket opening / connection on
socket.on("connect", function () {
  console.log(`Connected with id = ${socket.id}`); //socket undefined when not connected yet
  readTodo();
});
//NOTE: "connect" means both connect and re-connect (connect after connection was closed)
//NOTE: at "conenct" event a new unique socket id is assigned to a socket (before connection there is no id)

//on socket closed / disconnected
socket.on("disconnect", function(reason) {
    //when the socket disconnects / closes its socket id is reset
    console.log(`Disconnected because: ${reason} (id = ${socket.id})`);
});
//NOTE: if we disconnect manually (from client or server), reconnection will not be automatic by the client

//listen from broadcast events from server
socket.on("todo-create-broadcast", onTodoCreateBroadcast);
socket.on("todo-update-broadcast", onTodoUpdateBroadcast);
socket.on("todo-delete-broadcast", onTodoDeleteBroadcast);
