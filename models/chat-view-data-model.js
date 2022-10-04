//imports custom
const Chat = require("./chat-model");

//this class describes a chat pointing at one room, and contains
//only the data that the viewer needs to know
class ChatViewData {
  constructor(chat, errorList) {
    this.roomId = chat.roomId;
    this.friendsNames = chat.friendsNames; //array of strings
    this.messages = chat.messages; //arrai of MessageViewData class objects
    this.errorList = errorList; //array of error codes

    //NOTE:
    //  If friendsNames = [] it means user has not friends in this room in case there is no error code 1001 in errorList;
    //  If error code 1001 is present and friendsNames = [], it means the server failed in collecting friends names for this room;
    //  The same applies for messages, in case of error code 1002
  }

  //map a room into a ChatViewData class
  static async fromRoomToChatViewData(room, viewerId) {
    //create a chat object from a room
    const chat = new Chat(room, viewerId);

    //init error info
    let errorList = [];

    try {
      //collect friends names of this room inside this chat
      await chat.fillWithfriendsNames();
    } catch (error) {
      //if it was not possible to fill the chat with room messages
      errorList.push[1001];
      console.log(error);
    }

    try {
      //collect messages of this room inside this chat
      await chat.fillWithMessages();
    } catch (error) {
      //if it was not possible to fill the chat with room messages
      errorList.push[1002];
      console.log(error);
    }

    //get only chat data that user needs to know
    return new ChatViewData(chat, errorList);
  }
}

//exports
module.exports = ChatViewData;
