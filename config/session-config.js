//imports built in
//...

//imports 3rd party
const mongoDbStore = require("connect-mongodb-session");
const expressSession = require("express-session");

//imports custom
//...

//environment variable for the database URL
let mongodbUrl = "mongodb://127.0.0.1:27017";
if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL;
}

//environment variable for the session secret
let sessionSecret = "super-secret";
if (process.env.SESSION_SECRET) {
  sessionSecret = process.env.SESSION_SECRET;
}

//create a session store for the session package passed as parameter
function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);
  const store = new MongoDBStore({
    uri: mongodbUrl,
    databaseName: "socketio-live-chat",
    collection: "sessions",
  });
  return store;
}

//create configuration data for the session package
function createSessionConfig() {
  return {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 1 * (1000 * 60 * 60 * 24), // X * (days in [ms])
      sameSite: "lax",
    },
  };
}

//export
module.exports = createSessionConfig;
