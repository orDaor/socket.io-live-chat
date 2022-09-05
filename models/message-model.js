//imports 3r party
const ObjectId = require("mongodb").ObjectId;

//imports built-in
const db = require("../data/database");

class Message {
  constructor(text, recipientId, senderId, messageId) {
    this.text = text;
    this.recipientId = recipientId;
    this.senderId = senderId;
    if (messageId) {
      this.messageId = messageId.toString();
    }
  }

  //generate Message class obj from mongodb document
  static fromMongoDBDocumentToMessage(document) {
    return new Message(
      document.text,
      document.recipientId,
      document.senderId,
      document._id
    );
  }

  //find a message by its id
  static async findById(messageId) {
    //define query filter
    const query = { _id: new ObjectId(messageId) };

    //run query
    const document = await db.getDb().collection("messages").findOne(query);

    //no message found
    if (!document) {
      throw new Error("No message found");
    }

    //return Message class obj
    return Message.fromMongoDBDocumentToMessage(document);
  }

  //delete a message by its id
  static async deleteById(messageId) {
    const query = { _id: new ObjectId(messageId) };
    const result = await db.getDb().collection("messages").deleteOne(query);
    if (!result.deletedCount) {
      throw new Error("No message was deleted");
    }
  }

  //save a new message
  async save() {
    if (!this.messageId) {
      const result = await db.getDb().collection("messages").insertOne(this);
      return result.insertedId;
    }
  }
}

//exports
module.exports = Message;
