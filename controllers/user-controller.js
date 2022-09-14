//import 3rd party
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

function signup() {
  //const hashedPassword = await bcrypt.hash(this.password, 12);
}

function login() {
  //const result = await bcrypt.compare(this.password, hashedPassword);
}

//exports
module.exports = {
  signup: signup,
  login: login,
};
