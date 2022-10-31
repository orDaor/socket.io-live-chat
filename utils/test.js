//imports custom
const Message = require("../models/message-model");
const db = require("../data/database");

//insert a lot of messages for testing "step by step" messages loading
async function insertMany(sectionsNumber, roomId, sendersIds) {
  //clean current messages
  try {
    await db.getDb().collection("messages").deleteMany({});
  } catch (error) {
    return;
  }

  //save test messages
  for (let i = 1; i <= sectionsNumber; i++) {
    //messages user1
    const messagesUser1 = [
      new Message(`text ${i}`, roomId, sendersIds[0]), //user 1
      new Message(`text ${i}`, roomId, sendersIds[0]), //user 1
    ];

    //save messages user 1
    try {
      await db.getDb().collection("messages").insertMany(messagesUser1);
    } catch (error) {
      //??
    }

    //messages user 2
    const messagesUser2 = [
      new Message(`text ${i + 1}`, roomId, sendersIds[1]), //user 1
      new Message(`text ${i + 1}`, roomId, sendersIds[1]), //user 1
    ];

    //save messages user 2
    try {
      await db.getDb().collection("messages").insertMany(messagesUser2);
    } catch (error) {
      //??
    }
  }
}

//exmports test fucntions
module.exports = {
  insertMany: insertMany,
};
