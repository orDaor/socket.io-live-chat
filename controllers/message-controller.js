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

  //map each room connected to this user to a chat item which
  //collects inside of it all messages for this room
  const mapOneRoom = async function (room) {
    const chat = new Chat(room, res.locals.userId);
    try {
      //collect friends names
      //..??
      //collect messages
      await chat.fillWithMessages();
    } catch (error) {
      //if it was not possible to fill the chat with room messages
      console.log(error);
    }
    return chat;
  };

  //All user chats are collected in the chatList array, send it back in the response
  responseData.message = "Chats collected successfully";
  responseData.chatList = rooms.map(mapOneRoom);
  res.json(responseData);
}

//exports
module.exports = {
  readAll: readAll,
};
