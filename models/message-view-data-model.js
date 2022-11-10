//this class describes how a message should be visualized on the client side
class MessageViewData {
  //a Message class object can be passed to the constructor, and
  //the user id of the user requesting this message to be displayed.
  //If no message is passed, then single message data should be passed
  constructor(message, viewerId, sendingFailed, sendingFailedReason) {
    //general message data
    this.text = message.text;
    this.creationDate = message.creationDate;
    this.senderIsViewer = message.senderId === viewerId;
    this.messageId = message.messageId;
    if (sendingFailed) {
      this.sendingFailed = true;
      this.sendingFailedReason = sendingFailedReason;
    } else {
      this.sendingFailed = false;
      this.sendingFailedReason = "";
    }
  }

  //sort array of MessageViewData messages from oldest to most recent
  static sortFromOldestToMostRecent(messages) {
    const sortLogic = function (m1, m2) {
      //m1 is more recent
      if (m1.creationDate > m2.creationDate) {
        return 1;
      }

      //m2 is more recent
      if (m2.creationDate > m1.creationDate) {
        return -1;
      }

      //same date, keep original order
      if (m2.creationDate === m1.creationDate) {
        return 0;
      }
    };

    //sort the messages
    messages.sort(sortLogic);
  }
}

//exports
module.exports = MessageViewData;
