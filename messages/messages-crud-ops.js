//imports built in
const db = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

//create 
async function create(text) {
  let result;
  const message = { text: text };

  try {
    result = await db.getDb().collection("messages").insertOne(message);
  } catch (error) {
    console.log(error);
  }

  return result;
}

//read 
async function read() {
  let result;
  try {
    result = await db.getDb().collection("messages").find().toArray();
    // if (!result.length) {
    //   result = undefined;
    // }
  } catch (error) {
    console.log(error);
  }
  return result;
}

//update 
async function update(newText, messageId) {
  let result;
  const query = { _id: new ObjectId(messageId) };
  const update = {
    $set: { text: newText },
  };

  try {
    result = await db.getDb().collection("messages").updateOne(query, update);
    if (!result.matchedCount) {
      result = undefined;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

//delete 
async function remove(messageId) {
  let result;
  const query = { _id: new ObjectId(messageId) };

  try {
    result = await db.getDb().collection("messages").deleteOne(query);
    if (!result.deletedCount) {
      result = undefined;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

//exports
module.exports = {
  create: create,
  read: read,
  update: update,
  remove: remove,
};
