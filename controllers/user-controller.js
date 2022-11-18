//import 3rd party
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//imports custom
const validation = require("../utils/validation-util");
const authentication = require("../utils/authentication-util");
const User = require("../models/user-model");
const Room = require("../models/room-model");

//time constants
const oneHour_s = 60 * 60; //s
const oneDay_s = oneHour_s * 24; //s

//environment variable for JWT secret key
let tokenKey = "not-a-secret";
if (process.env.TOKEN_KEY) {
  tokenKey = process.env.TOKEN_KEY;
}

//create a new user account
async function signup(req, res, next) {
  //init response data
  let responseData = {};

  //received user input
  const unserInput = req.body;

  //user input validation
  const validatedUserInput = validation.userData(unserInput, false);
  if (!validatedUserInput) {
    responseData.message = `User name length must be between ${validation.minUserNameLength} and ${validation.maxUserNameLength}.
       Password must be at least ${validation.minPasswordLength} characters long`;
    responseData.userInputNotValid = true;
    res.json(responseData);
    return;
  }

  //check whether an account with the requested name
  let existingUser;
  try {
    existingUser = await User.findByName(validatedUserInput.validatedUserName);
    //user exists already
    if (existingUser) {
      responseData.userExistsAlready = true;
      responseData.message = "A user with this name exists already";
      res.json(responseData);
      return;
    }
  } catch (error) {
    if (error.code !== 404) {
      next(error);
      return;
    }
  }

  //hash password
  const hashedPassword = await bcryptjs.hash(
    validatedUserInput.validatedPassword,
    12
  );

  //create a new user account
  const user = new User(validatedUserInput.validatedUserName, hashedPassword);

  //save user in the DB
  try {
    await user.save();
  } catch (error) {
    next(error);
    return;
  }

  //response
  responseData.message = "User registered successfully";
  res.json(responseData);
}

//login with a new user account
async function login(req, res, next) {
  //init response data
  let responseData = {};

  //received user input
  const userName = req.body.userName.trim();
  const password = req.body.password;

  //check if a user with this name exists
  let existingUser;
  try {
    existingUser = await User.findByName(userName);
  } catch (error) {
    if (error.code !== 404) {
      next(error);
      return;
    }
  }

  //user does not exist
  if (!existingUser) {
    responseData.invalidCredentials = true;
    responseData.message = "The credentials are incorrect";
    res.json(responseData);
    return;
  }

  //check the entered password matches the account one
  const isPasswordCorrect = await bcryptjs.compare(
    password,
    existingUser.password
  );

  //password not correct
  if (!isPasswordCorrect) {
    responseData.invalidCredentials = true;
    responseData.message = "The credentials are incorrect";
    res.json(responseData);
    return;
  }

  //login was successfull, create JWT and send it back in the response
  const jwtPayload = {
    userId: existingUser.userId,
  };

  //token contains id of the user account with which login was successfully perfomed
  jwt.sign(
    jwtPayload,
    tokenKey,
    {
      expiresIn: oneDay_s * 2,
      algorithm: "HS256",
    },
    function (error, token) {
      //get token and send response
      authentication.jwtSignCallback(
        error,
        token,
        existingUser.name,
        res,
        responseData,
        next
      );
    }
  );
}

//invitation link handling
async function handleInvitationLink(req, res, next) {
  //id of the room where this user is invited
  const invitationId = req.params.invitationId;

  //init invitation info to be sent back in the response page
  let locals = res.locals;
  locals.invitationInfo = {};
  locals.invitationInfo.invitationId = invitationId;

  //check if the user can actually access this room
  let result;
  try {
    result = await Room.checkAvailability(invitationId);
  } catch (error) {
    //client will display error message
    locals.invitationInfo.inviterName = "";
    res.render("chat");
    return;
  }

  //the user who issued the invitation link
  locals.invitationInfo.inviterName = result.inviter.name;
  //response
  res.render("chat");
}

//exports
module.exports = {
  signup: signup,
  login: login,
  handleInvitationLink: handleInvitationLink,
};
