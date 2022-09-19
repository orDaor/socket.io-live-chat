//imports custom
const Message = require("../models/message-model");
const MessageViewData = require("../models/message-view-data-model");
const User = require("../models/user-model");

//this class describes a chat between friends in a specific room
class Chat {
  constructor(room, viewerId) {
    if (!room || !viewerId) {
      throw new Error("Can not create a chat without a room");
    }

    //id of the room to which this chat is mapped
    this.roomId = room.roomId;

    //id of the user who is requesting to view this chat content
    this.viewerId = viewerId;

    //friends chatting in this room
    this.friends = room.friends; //array of user ids

    //exclude viewer id from friends list
    const index = this.friends.indexOf(this.viewerId);
    if (index > -1) {
      this.friends.splice(index, 1);
    }

    //messages exchanged in this chat (viewer's ones are included)
    this.messages = []; //array of MessageViewData class objects
  }

  //collect friend names for this room
  async fillWithfriendNames() {}

  //collect messages for this room
  async fillWithMessages() {
    //find messages sent into this room context
    const messages = await Message.findManyByRoomId(this.roomId);
    //map each messages in MessageViewData class objects
    const mapOneMessage = function (message) {
      return new MessageViewData(message, this.viewerId);
    };
    this.messages = messages.map(mapOneMessage);
  }
}

//exports
module.exports = Chat;
