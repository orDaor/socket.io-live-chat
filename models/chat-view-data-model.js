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

  //sort array of ChatViewData class objects: most recent chats go first
  //NOTE: a chat is more recent than another one, if the last message of the first chat is more recent
  static sortChatListFromMostRecentToOldest(chatList) {
    //if array contains less than 2 items, it should not be ordered
    if (chatList.length < 2) {
      return;
    }

    //array contains at least 2 items, then can be ordered
    const sortLogic = function (chat_1, chat_2) {
      //sample date now
      const dateNow = new Date();

      //chat 1 last message date
      const chat_1_messagesNumber = chat_1.messages.length;
      let chat_1_lastMessage;
      let chat_1_lastMessageCreationDate;

      if (!chat_1_messagesNumber) {
        if (!chat_1.errorList.includes(1002)) {
          //chat 1 has no messages because no messages were sent yet
          //Then consider this as old
          chat_1_lastMessageCreationDate = 0; //dateNow;
        } else {
          //chat 1 has no messages because no messages server failed to fetch them
          //Then consider this as old
          chat_1_lastMessageCreationDate = 0;
        }
      } else {
        //chat 1 has messages
        chat_1_lastMessage = chat_1.messages[chat_1_messagesNumber - 1];
        chat_1_lastMessageCreationDate = chat_1_lastMessage.creationDate;
      }

      //chat 2 last message date
      const chat_2_messagesNumber = chat_2.messages.length;
      let chat_2_lastMessage;
      let chat_2_lastMessageCreationDate;

      if (!chat_2_messagesNumber) {
        if (!chat_2.errorList.includes(1002)) {
          //chat 2 has no messages because no messages were sent yet
          //Then consider this as old
          chat_2_lastMessageCreationDate = 0; //dateNow;
        } else {
          //chat 2 has no messages because no messages server failed to fetch them
          //Then consider this as old
          chat_2_lastMessageCreationDate = 0;
        }
      } else {
        //chat 2 has messages
        chat_2_lastMessage = chat_2.messages[chat_2_messagesNumber - 1];
        chat_2_lastMessageCreationDate = chat_2_lastMessage.creationDate;
      }

      //chat 1 is older --> must come after
      if (chat_1_lastMessageCreationDate < chat_2_lastMessageCreationDate) {
        return 1;
      }

      //chat 1 is more recent --> must come before
      if (chat_1_lastMessageCreationDate > chat_2_lastMessageCreationDate) {
        return -1;
      }

      //same date case
      if (chat_1_lastMessageCreationDate === chat_2_lastMessageCreationDate) {
        return 0;
      }
    };

    //order the array
    chatList.sort(sortLogic);
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
