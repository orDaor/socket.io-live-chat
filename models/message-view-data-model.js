//this class describes how a message should be visualized on the client side
class MessageViewData {
  //a Message class object is passed to the constructor, and
  //the user id of the user requesting this message to be displayed
  constructor(message, viewerId) {
    //general message data
    this.text = message.text;
    this.creationDate = message.creationDate;
    this.messageId = message.messageId;

    //if this user who sent this message is the same who wants to vizualize it
    this.senderIsViewer = message.senderId === viewerId;
  }
}

//exports
module.exports = MessageViewData;
