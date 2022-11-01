//imports custom
const Message = require("../models/message-model");
const db = require("../data/database");

//insert a lot of messages for testing "step by step" messages loading
async function insertManyMessages(iterationsNumber, roomId, sendersIds) {
  //clean current messages
  try {
    await db.getDb().collection("messages").deleteMany({});
  } catch (error) {
    return;
  }

  //current user message
  let currentUser = 1;

  //save test messages
  for (let i = 1; i <= iterationsNumber; i++) {
    if (currentUser === 1) {
      //save message 1
      const message1 = new Message(`text ${i}`, roomId, sendersIds[0]);
      try {
        await db.getDb().collection("messages").insertOne(message1);
      } catch (error) {
        //??
      }

      //save message 2
      const message2 = new Message(`text ${i}`, roomId, sendersIds[0]);
      try {
        await db.getDb().collection("messages").insertOne(message2);
      } catch (error) {
        //??
      }

      //switch to user 2
      currentUser = 2;
    } else if (currentUser === 2) {
      //save message 1
      const message1 = new Message(`text ${i}`, roomId, sendersIds[1]);
      try {
        await db.getDb().collection("messages").insertOne(message1);
      } catch (error) {
        //??
      }

      //save message 2
      const message2 = new Message(`text ${i}`, roomId, sendersIds[1]);
      try {
        await db.getDb().collection("messages").insertOne(message2);
      } catch (error) {
        //??
      }

      //switch to user 1
      currentUser = 1;
    }
  }

  //test messages saved
  console.log("Test messages saved");
}

//exmports test fucntions
module.exports = {
  insertManyMessages: insertManyMessages,
};
