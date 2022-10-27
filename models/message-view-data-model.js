//this class describes how a message should be visualized on the client side
class MessageViewData {
  //a Message class object can be passed to the constructor, and
  //the user id of the user requesting this message to be displayed.
  //If no message is passed, then single message data should be passed
  constructor(message, viewerId) {
    //general message data
    this.text = message.text;
    this.creationDate = message.creationDate;
    this.senderIsViewer = message.senderId === viewerId;
    this.messageId = message.messageId;
  }
}

//exports
module.exports = MessageViewData;
