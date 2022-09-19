//imports 3r party
const ObjectId = require("mongodb").ObjectId;

//imports built-in
const Message = require("../models/message-model");
const MessageViewData = require("../models/message-view-data-model");

//this class describes a chat between friends in a specific room
class Chat {
  constructor(roomId) {
    if (!roomId) {
      throw new Error("Can not create a chat without a room");
    }

    this.roomId = roomId;
    this.friendsNames = [];
    this.messages = []; //array of MessageViewData class objects
  }

  //collect messages for this room
  async fillWithMessages(viewerId) {
    //find messages sent into this room context
    const messages = await Message.findManyByRoomId(this.roomId);
    //map each messages in MessageViewData class objects
    const mapOneMessage = function (message) {
      return new MessageViewData(message, viewerId);
    };
    this.messages = messages.map(mapOneMessage);
  }
}

//exports
module.exports = Chat;
