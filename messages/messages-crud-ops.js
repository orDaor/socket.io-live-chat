//imports built in
const db = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

//create
async function save(message, senderId) {
  let result;

  const fullMessage = {
    ...message,
    senderId: senderId,
  };

  try {
    result = await db.getDb().collection("messages").insertOne(fullMessage);
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
  save: save,
  read: read,
  remove: remove,
};
