//imports 3r party
const ObjectId = require("mongodb").ObjectId;

//imports custom
const db = require("../data/database");
const User = require("../models/user-model");

//environment variable for the website domain
let domain = "http://localhost:3000";
if (process.env.DOMAIN) {
  domain = process.env.DOMAIN;
}

class Room {
  constructor(friends, lastViewDates, lastActivityDate, roomId) {
    //date this room is created
    const dateNow = new Date();

    //array of user Ids as normal strings
    this.friends = friends;

    //array of dates
    if (lastViewDates) {
      this.lastViewDates = lastViewDates;
    } else {
      this.lastViewDates = this.friends.map(function (userId) {
        return dateNow;
      });
    }

    //last date when a message was sent in this room context
    if (lastActivityDate) {
      this.lastActivityDate = lastActivityDate;
    } else {
      this.lastActivityDate = dateNow;
    }

    if (roomId) {
      this.roomId = roomId.toString();
    }
  }

  //generate Room class obj from mongodb document
  static fromMongoDBDocumentToRoom(document) {
    return new Room(
      document.friends,
      document.lastViewDates,
      document.lastActivityDate,
      document._id
    );
  }

  //find a room by its id
  static async findById(roomId) {
    //define query filter
    const query = { _id: new ObjectId(roomId) };

    //run query
    const document = await db.getDb().collection("rooms").findOne(query);

    //no room found
    if (!document) {
      const error = new Error("No room found");
      error.code = 404;
      throw error;
    }

    //return room class obj
    return Room.fromMongoDBDocumentToRoom(document);
  }

  //find rooms where a specific user is active
  static async findManyByUserId(userId, includeDocsWithUserAlone) {
    //query filter: look for all rooms where the user with
    //userId is active (contained in the friends list)
    let query;
    if (includeDocsWithUserAlone) {
      query = {
        friends: { $in: [userId] },
      };
    } else {
      query = {
        $and: [
          { friends: { $in: [userId] } },
          { "friends.1": { $exists: true } }, //at least 2 friends in this room
        ],
      };
    }

    //sorting by last activity date, from most recent (highest date value)
    //to eldets (lowest date value)
    const sortLogic = { lastActivityDate: -1 };

    const documents = await db
      .getDb()
      .collection("rooms")
      .find(query)
      .sort(sortLogic)
      .toArray();

    //map array of room documents into array of Room class objects
    const mapOneDocument = function (document) {
      return Room.fromMongoDBDocumentToRoom(document);
    };
    return documents.map(mapOneDocument);
  }

  //find rooms which contains all specified user ids
  static async findManyByUserIds(userIds) {
    //query filter
    const query = {
      friends: { $all: userIds },
    };

    //run query
    const documents = await db
      .getDb()
      .collection("rooms")
      .find(query)
      .toArray();

    //map array of user documents into array of User class objects
    const mapOneDocument = function (document) {
      return Room.fromMongoDBDocumentToRoom(document);
    };
    return documents.map(mapOneDocument);
  }

  //find a room where a specific user is waiting for a friend to accept his invitation
  static async findWithOneUserWaiting(userId) {
    //query filter
    const query = {
      $and: [{ friends: { $size: 1 } }, { friends: { $in: [userId] } }],
    };

    //run query
    const document = await db.getDb().collection("rooms").findOne(query);

    //no room was found
    if (!document) {
      return document; //undefined
    }

    //a room was found, return room class obj
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

  //check if this room is available (if a user can enter this room)
  static async checkAvailability(roomId) {
    //check if a room with id = invitation id exist
    const room = await Room.findById(roomId);

    //there should be only 1 user in this room waiting for another one to join
    if (room.friends.length !== 1) {
      throw new Error("Only 1 user should be waiting inside this room");
    }

    //look for the user who generated this link
    const inviterId = room.friends[0];
    const inviter = await User.findById(inviterId);

    //return the available room and the inviter inside of it
    return {
      room: room,
      inviter: inviter,
    };
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

  //check whether a room contains a specific user or not
  containsUser(userId) {
    const userIndex = this.friends.indexOf(userId);
    if (userIndex > -1) {
      return userIndex;
    } else {
      return -1;
    }
  }

  //update the valie of on last view date
  setOneLastViewDate(arrIndex, date) {
    this.lastViewDates[arrIndex] = date;
  }

  //generate mongodb document from Room class obj
  fromRoomToMongoDBDocument() {
    return {
      friends: this.friends,
      lastViewDates: this.lastViewDates,
      lastActivityDate: this.lastActivityDate,
    };
  }

  //generate invitation link for connecting with this user
  getInvitationLink() {
    return domain + "/user/invitation/" + this.roomId;
  }
}

//exports
module.exports = Room;
