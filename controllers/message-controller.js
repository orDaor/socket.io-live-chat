//imports custom
const Room = require("../models/room-model");
const ChatViewData = require("../models/chat-view-data-model");

//read user chats
async function readAll(req, res, next) {
  //init response data
  let responseData = {};

  //get rooms where user is active
  let rooms;

  try {
    rooms = await Room.findManyByUserId(res.locals.userId);
  } catch (error) {
    next(error);
    return;
  }

  //map each room connected to this user to a chat item which
  //collects inside of it all messages for this room
  let chatList = [];

  //map rooms array into chat list
  for (const room of rooms) {
    const chat = await ChatViewData.fromRoomToChatViewData(
      room,
      res.locals.userId
    );
    chatList.push(chat);
  }

  //sort chats from most recent to oldest
  ChatViewData.sortChatListFromMostRecentToOldest(chatList);

  //All user chats are collected in the chatList array, send it back in the response
  responseData.message = "Chats collected successfully";
  responseData.chatList = chatList; //sorted
  res.json(responseData);
}

//exports
module.exports = {
  readAll: readAll,
};
