//imports built in
const db = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

//create todo
async function createTodo(todoText) {
  let result;
  const todo = { todoText: todoText };

  try {
    result = await db.getDb().collection("todos").insertOne(todo);
  } catch (error) {
    console.log(error);
  }

  return result;
}

//read todo
async function readTodo() {
  let result;
  try {
    result = await db.getDb().collection("todos").find().toArray();
    // if (!result.length) {
    //   result = undefined;
    // }
  } catch (error) {
    console.log(error);
  }
  return result;
}

//update todo
async function updateTodo(newTodoText, id) {
  let result;
  const query = { _id: new ObjectId(id) };
  const update = {
    $set: { todoText: newTodoText },
  };

  try {
    result = await db.getDb().collection("todos").updateOne(query, update);
    if (!result.matchedCount) {
      result = undefined;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

//delete todo
async function deleteTodo(id) {
  let result;
  const query = { _id: new ObjectId(id) };

  try {
    result = await db.getDb().collection("todos").deleteOne(query);
    if (!result.deletedCount) {
      result = undefined;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

//todos crud handler
async function todosCrudHandler(todoText, id) {}

//exports
module.exports = {
  createTodo: createTodo,
  readTodo: readTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo,
  todosCrudHandler: todosCrudHandler,
};
