//imports custom
const Message = require("../models/message-model");
const MessageViewData = require("../models/message-view-data-model");
const User = require("../models/user-model");

//this class describes a chat between friends in a specific room, which was
//requested by viewer, which is a user whith id = viewerId
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
    const viewerIndexInRoom = this.friends.indexOf(this.viewerId);
    if (viewerIndexInRoom > -1) {
      this.friends.splice(viewerIndexInRoom, 1);
    } else {
      throw new Error("Can not find the viewerId in the room");
    }

    //friends names
    this.friendsNames = []; //array of name

    //messages exchanged in this chat (viewer's ones are included)
    this.messages = []; //array of MessageViewData class objects

    //last date the viewerId user viewed this chat
    this.lastViewDate = room.lastViewDates[viewerIndexInRoom];
  }

  //collect friend names for this room
  async fillWithfriendsNames() {
    const users = await User.findManyByIds(this.friends);
    const mapOneUser = function (user) {
      return user.name;
    };
    this.friendsNames = users.map(mapOneUser);
  }

  //collect messages for this room
  async fillWithMessages() {
    //find messages sent into this room context
    const messages = await Message.findManyByRoomId(this.roomId);

    //map each messages in MessageViewData class objects
    const viewerId = this.viewerId;
    const mapOneMessage = function (message) {
      return new MessageViewData(message, viewerId);
    };
    const mappedMessages = messages.map(mapOneMessage);

    //sort messages from oldest to more recent
    MessageViewData.sortFromOldestToMostRecent(mappedMessages);

    this.messages = mappedMessages;
  }
}

//exports
module.exports = Chat;
