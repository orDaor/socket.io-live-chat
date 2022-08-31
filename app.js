//imports built-in
const http = require("http");
const path = require("path");

//imports 3rd party
const express = require("express");
const SocketIOServer = require("socket.io").Server;

//imports custom
const db = require("./data/database");
const listenOnSocketEvents = require("./socket-io/listen-on-socket-events");

//web server
const app = express();
const server = http.createServer(app);

//web socket server
const io = new SocketIOServer(server);

//ejs engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//static files middleware
app.use(express.static("public"));

//JSON body parser
app.use(express.json());

//main apge
app.get("/", function (req, res, next) {
  res.render("todo");
});

//listen on connection event for incoming sockets.
//NOTE: a different websocket connection will be established with each browser tab!
io.on("connection", function (socket) {
  //how should be handled the established connection
  listenOnSocketEvents(io, socket);
});

//init connection to database
db.connectToDatabase()
  .then(function () {
    //starting web server
    server.listen(3000);
  })
  .catch(function (error) {
    console.log(error);
  });
