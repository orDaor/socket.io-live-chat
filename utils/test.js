//imports custom
const Message = require("../models/message-model");
const db = require("../data/database");

//insert a lot of messages for testing "step by step" messages loading
async function insertManyMessages(
  iterationsNumber,
  roomId,
  sendersIds,
  deleteOldMessages
) {
  if (deleteOldMessages) {
    //clean current messages
    try {
      await db.getDb().collection("messages").deleteMany({});
    } catch (error) {
      return;
    }
  }

  //waiting time before two DB queries
  const delay_ms = 1;

  //current user message
  let currentUser = 1;

  //save test messages
  for (let i = 1; i <= iterationsNumber; i++) {
    if (currentUser === 1) {
      //save message 1
      const message1 = new Message(`text ${i}`, roomId, sendersIds[0]);
      // const message2 = new Message(`text ${i}`, roomId, sendersIds[0]);
      try {
        await db.getDb().collection("messages").insertOne(message1);
      } catch (error) {
        //??
      }

      await new Promise((r) => setTimeout(r, delay_ms));

      //save message 2
      const message2 = new Message(`text ${i}`, roomId, sendersIds[0]);
      try {
        await db.getDb().collection("messages").insertOne(message2);
      } catch (error) {
        //??
      }

      await new Promise((r) => setTimeout(r, delay_ms));

      //switch to user 2
      currentUser = 2;
    } else if (currentUser === 2) {
      //save message 1
      const message1 = new Message(`text ${i}`, roomId, sendersIds[1]);
      // const message2 = new Message(`text ${i}`, roomId, sendersIds[1]);
      try {
        await db.getDb().collection("messages").insertOne(message1);
      } catch (error) {
        //??
      }

      await new Promise((r) => setTimeout(r, delay_ms));

      //save message 2
      const message2 = new Message(`text ${i}`, roomId, sendersIds[1]);
      try {
        await db.getDb().collection("messages").insertOne(message2);
      } catch (error) {
        //??
      }

      await new Promise((r) => setTimeout(r, delay_ms));

      //switch to user 1
      currentUser = 1;
    }
  }

  //test messages saved
  console.log("Test messages saved");
}

//insert actual messages for different chatrooms
async function callInsertManyMessages(disableTesting) {
  //check if testing is disabled
  if (disableTesting) {
    return;
  }

  //save test messages
  insertManyMessages(
    20,
    "6377877b1fa16db7c56f0f5c",
    ["636a825d22d5e6ed36883c77", "636a826c22d5e6ed36883c78"],
    true
  );

  //save test messages
  // insertManyMessages(
  //   20,
  //   "6374c42ca699ab614b1ad5c6",
  //   ["636a826c22d5e6ed36883c78", "636aae50048d7522f43d9027"],
  //   false
  // );
}

//exmports test fucntions
module.exports = {
  callInsertManyMessages: callInsertManyMessages,
  insertManyMessages: insertManyMessages,
};
