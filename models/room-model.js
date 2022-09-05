//imports 3r party
const ObjectId = require("mongodb").ObjectId;

//imports built-in
const db = require("../data/database");

class Room {
  constructor(friends, lastActivityDate, roomId) {
    this.friends = friends;
    if (lastActivityDate) {
      this.lastActivityDate = lastActivityDate;
    } else {
      this.lastActivityDate = new Date(); //now
    }
    if (roomId) {
      this.roomId = roomId.toString();
    }
  }

  //generate Room class obj from mongodb document
  static fromMongoDBDocumentToRoom(document) {
    return new Room(document.friends, document.lastActivityDate, document._id);
  }

  //generate mongodb document from Room class obj
  static fromRoomToMongoDBDocument() {
    return {
      friends: this.friends,
      lastActivityDate: this.lastActivityDate,
    };
  }

  //find a room by its id
  static async findById(roomId) {
    //define query filter
    const query = { _id: new ObjectId(roomId) };

    //run query
    const document = await db.getDb().collection("rooms").findOne(query);

    //no room found
    if (!document) {
      throw new Error("No room found");
    }

    //return room class obj
    return Room.fromMongoDBDocumentToRoom(document);
  }

  //delete a room by its id
  static async deleteById(roomId) {
    const query = { _id: new ObjectId(roomId) };
    const result = await db.getDb().collection("rooms").deleteOne(query);
    if (!result.deletedCount) {
      throw new Error("No room was deleted");
    }
  }

  //save a new room or update an existing one
  async save() {
    if (!this.roomId) {
      //new room
      const result = await db.getDb().collection("rooms").insertOne(this);
      return result.insertedId;
    } else {
      //update existing
      const query = { _id: new ObjectId(this.roomId) };
      const update = {
        $set: this.fromRoomToMongoDBDocument(),
      };
      const result = await db
        .getDb()
        .collection("rooms")
        .updateOne(query, update);
      //no room found for update
      if (!result.matchedCount) {
        throw new Error("No room found for update");
      }
    }
  }
}

//exports
module.exports = Room;
