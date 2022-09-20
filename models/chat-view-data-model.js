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
}

//exports
module.exports = ChatViewData;
