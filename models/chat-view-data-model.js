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

    //last time the viewer has viewed this chat room
    const messagesNumber = this.messages.length;
    if (!messagesNumber) {
      //should mark this message as read on screen
      this.viewed = true;
    } else {
      //find last message sent by friends of the viewer
      const lastFriendsMessageIndex = this.getFriendsLastMessageIndex();

      //no message from friends yet
      if (lastFriendsMessageIndex === -1) {
        //should mark this message as read on screen
        this.viewed = true;
        return;
      }

      //at leas one message from friends was found, get date of last sent one
      const lastFriendsMessageDate =
        this.messages[lastFriendsMessageIndex].creationDate;

      //check if last friends message was already viewd
      if (chat.lastViewDate >= lastFriendsMessageDate) {
        //should mark this message as read on screen
        this.viewed = true;
      } else {
        //should mark this message as UN-read on screen
        this.viewed = false;
      }
    }
  }

  //map a room into a ChatViewData class
  static async fromRoomToChatViewData(room, viewerId) {
    //create a chat object from a room
    const chat = new Chat(room, viewerId);

    //init error info
    let errorList = [];

    //collect friends names of this room inside this chat
    try {
      await chat.fillWithfriendsNames();
    } catch (error) {
      //if it was not possible to fill the chat with room messages
      errorList.push(1001);
      console.log(error);
    }

    //collect messages of this room inside this chat
    try {
      await chat.fillWithMessages();
    } catch (error) {
      //if it was not possible to fill the chat with room messages
      errorList.push(1002);
      console.log(error);
    }

    //get only chat data that user needs to know
    return new ChatViewData(chat, errorList);
  }

  //get last message from friends
  getFriendsLastMessageIndex() {
    //find logic
    function findMessage(message) {
      return !message.senderIsViewer;
    }

    //copy messages of this chat into a new different array
    const messages = Array.from(this.messages);

    //revert messages, to get them from more recent to olders
    messages.reverse();

    //find most recent friends message
    const tempIndex = messages.findIndex(findMessage);
    if (tempIndex === -1) {
      //no message found
      return -1;
    } else {
      //map index of the found reverted-array-message to the non-reverted-array-message
      return messages.length - tempIndex - 1;
    }
  }
}

//exports
module.exports = ChatViewData;
