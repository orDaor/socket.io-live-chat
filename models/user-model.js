//imports 3r party
const ObjectId = require("mongodb").ObjectId;

//imports built-in
const db = require("../data/database");

class User {
  constructor(name, password, regitrationDate, userId) {
    this.name = name;
    this.password = password;

    if (regitrationDate) {
      this.regitrationDate = regitrationDate;
    } else {
      this.regitrationDate = new Date(); //now
    }

    if (userId) {
      this.userId = userId.toString();
    }
  }

  //generate User class obj from mongodb document
  static fromMongoDBDocumentToUser(document) {
    return new User(
      document.name,
      document.password,
      document.regitrationDate,
      document._id
    );
  }

  //find a user by its id
  static async findById(userId) {
    //define query filter
    const query = { _id: new ObjectId(userId) };

    //run query
    const document = await db.getDb().collection("users").findOne(query);

    //no user found
    if (!document) {
      throw new Error("No user found");
    }

    //return user class obj
    return User.fromMongoDBDocumentToUser(document);
  }

  //delete a user by its id
  static async deleteById(userId) {
    const query = { _id: new ObjectId(userId) };
    const result = await db.getDb().collection("users").deleteOne(query);
    if (!result.deletedCount) {
      throw new Error("No user was deleted");
    }
  }

  //save a new user
  async save() {
    if (!this.userId) {
      const result = await db.getDb().collection("users").insertOne(this);
      return result.insertedId;
    }
  }
}

//exports
module.exports = User;
