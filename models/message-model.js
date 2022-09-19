//imports 3r party
const ObjectId = require("mongodb").ObjectId;

//imports custom
const db = require("../data/database");

//this class defines a message, sent by a specific sender to a specific room
class Message {
  constructor(text, roomId, senderId, creationDate, messageId) {
    this.text = text;
    this.roomId = roomId;
    this.senderId = senderId;

    if (creationDate) {
      this.creationDate = creationDate;
    } else {
      this.creationDate = new Date(); //now
    }

    if (messageId) {
      this.messageId = messageId.toString();
    }
  }

  //generate Message class obj from mongodb document
  static fromMongoDBDocumentToMessage(document) {
    return new Message(
      document.text,
      document.roomId,
      document.senderId,
      document.creationDate,
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

  //find messages sent to a specific room
  static async findManyByRoomId(roomId) {
    //query filer
    const query = { roomId: roomId };

    //run query
    const documents = await db
      .getDb()
      .collection("messages")
      .find(query)
      .toArray();

    //map array of message documents into array of Message class objects
    const mapOneDocument = function (document) {
      return Message.fromMongoDBDocumentToMessage(document);
    };
    return documents.map(mapOneDocument);
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
