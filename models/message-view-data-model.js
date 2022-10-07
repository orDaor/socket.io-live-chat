//this class describes how a message should be visualized on the client side
class MessageViewData {
  //a Message class object can be passed to the constructor, and
  //the user id of the user requesting this message to be displayed.
  //If no message is passed, then single message data should be passed
  constructor(
    message,
    viewerId,
    text,
    creationDate,
    senderIsViewer,
    messageId
  ) {
    if (message && viewerId) {
      //general message data
      this.text = message.text;
      this.creationDate = message.creationDate;
      this.senderIsViewer = message.senderId === viewerId;
      //if this user who sent this message is the same who wants to vizualize it
      if (this.senderIsViewer) {
        this.messageId = message.messageId;
      }
    } else {
      //compose message by single message data
      this.text = text;
      this.creationDate = creationDate;
      this.senderIsViewer = senderIsViewer;
      //if this user who sent this message is the same who wants to vizualize it
      if (this.senderIsViewer) {
        this.messageId = messageId;
      }
    }
  }
}

//exports
module.exports = MessageViewData;
