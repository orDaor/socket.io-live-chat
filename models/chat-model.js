//imports 3r party
const ObjectId = require("mongodb").ObjectId;

//imports built-in
const Message = require("../models/message-model");

//this class describes a chat between friends in a specific room
class Chat {
  constructor(roomId) {
    if (!roomId) {
      throw new Error("Can not create a chat without a room");
    }

    this.roomId = roomId;
    this.messages = [];
  }

  //collect messages for this room
  async fillWithMessages() {
    //find messages sent into this room context
    this.messages = await Message.findManyByRoomId(this.roomId);
  }
}

//exports
module.exports = Chat;
