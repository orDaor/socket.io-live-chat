//imports built-in
const http = require("http");
const path = require("path");

//imports 3rd party
const express = require("express");
const expressSession = require("express-session");
const csrf = require("csurf");
const SocketIOServer = require("socket.io").Server;

//imports custom
const db = require("./data/database");
const createSessionConfig = require("./config/session-config");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token-middleware");
const httpAuthCheckMiddleware = require("./middlewares/http-authentication-middleware");
const routesProtectionMiddleware = require("./middlewares/routes-protection-middleware");
const notFoundMidlleware = require("./middlewares/not-found-middleware");
const errorHandlingMiddleware = require("./middlewares/error-handling-middleware");
const baseRoutes = require("./routes/base-routes");
const userRoutes = require("./routes/user-routes");
const messageRoutes = require("./routes/message-routes");
const socketAuthCheckMiddleware = require("./socket.io/middlewares/socket-authentication-middleware");
const initSocket = require("./socket.io/events-listeners/socket-init");
const listenToBaseEvents = require("./socket.io/events-listeners/base-events-listeners");
const listenToUserEvents = require("./socket.io/events-listeners/user-events-listeners");
const listenToRoomEvents = require("./socket.io/events-listeners/room-events-listeners");
const listenToMessageEvents = require("./socket.io/events-listeners/message-events-listeners");

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

//express-session middleware
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

//csrf protection
app.use(csrf());

//generate CSRF token
app.use(addCsrfTokenMiddleware);

//http authentication middleware
app.use(httpAuthCheckMiddleware);

//base routes
app.use(baseRoutes);

//user routes
app.use("/user", userRoutes);

//routes protection middleware
app.use(routesProtectionMiddleware);

//messages routes
app.use("/message", messageRoutes);

//not found middleware
app.use(notFoundMidlleware);

//error handling middleware
app.use(errorHandlingMiddleware);

//socket authentication middleware
io.use(socketAuthCheckMiddleware);

//listen on connection event for incoming sockets
io.on("connection", function (socket) {
  //socket initialization
  initSocket(socket);
  //register event listeners for this socket
  listenToBaseEvents(io, socket);
  listenToUserEvents(io, socket);
  listenToRoomEvents(io, socket);
  listenToMessageEvents(io, socket);
});

//init the correct port number using an environment variable
let portNumber = 3000;
if (process.env.PORT) {
  portNumber = process.env.PORT;
}

//init connection to database
db.connectToDatabase()
  .then(function () {
    //starting web server
    server.listen(portNumber);
    //TODO: start async process for deleting once in a while incactive rooms
  })
  .catch(function (error) {
    console.log(error);
  });
