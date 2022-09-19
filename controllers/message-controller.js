//imports custom
const Room = require("../models/room-model");
const Chat = require("../models/chat-model");

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

  //for each room found for this user, collect the messages in a chat
  let chatList = [];
  for (const room of rooms) {
    const chat = new Chat(room.roomId);
    try {
      await chat.fillWithMessages(res.locals.userId);
      chatList.push(chat);
    } catch (error) {
      //if it was not possible to fill the chat with room messages then
      //a chat with empty messages array is pushed to the chat list array anyway
      chatList.push(chat);
    }
  }

  //All user chats are collected in the chatList array, send it back in the response
  responseData.message = "Chats collected successfully";
  responseData.chatList = chatList;
  res.json(responseData);
}

//exports
module.exports = {
  readAll: readAll,
};
