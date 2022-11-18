//import 3rd party
const WordsFilter = require("bad-words");
const wordsFilter = new WordsFilter();

//minumum user input lengths (excluded extra spaces)
const minPasswordLength = 5;
const minUserNameLength = 4;
const maxUserNameLength = 15;
const maxMessageTextLength = 1250;

//sign up input validation
function userData(userInput, loggingEnabled = false) {
  //user name validation
  const validatedUserName = userInput.userName.trim();
  const userNameOk =
    validatedUserName.length >= minUserNameLength &&
    validatedUserName.length <= maxUserNameLength;

  //password validation
  const validatedPassword = userInput.password;
  const passwordOk = validatedPassword.length >= minPasswordLength;

  if (loggingEnabled) {
    console.log(`userNameOk: ${!!userNameOk}`);
    console.log(`passwordOk: ${!!passwordOk}`);
  }

  if (userNameOk && passwordOk) {
    return {
      validatedUserName: validatedUserName,
      validatedPassword: validatedPassword,
    };
  } else {
    return undefined;
  }
}

//validate a message which the user tries to send
function message(message, loggingEnabled = true) {
  //text
  let validatedText = message.text.trim();
  const textOk = validatedText && validatedText.length <= maxMessageTextLength;

  //check for bad words in the text bad words
  let wordsOk;
  if (wordsFilter.isProfane(validatedText)) {
    wordsOk = false;
  } else {
    wordsOk = true;
    //still clean message in case isProfane above failed
    validatedText = wordsFilter.clean(validatedText);
  }

  //roomId
  const validatedRoomId = message.roomId.trim();
  const roomIdOk = validatedRoomId.length > 5;

  //temp message id
  const validatedTempMessageId = message.tempMessageId.trim();
  const tempMessageIdOk =
    validatedTempMessageId.length > 5 &&
    validatedTempMessageId.includes("temp-id");

  if (loggingEnabled) {
    console.log(`textOk: ${!!textOk}`);
    console.log(`wordsOk: ${!!wordsOk}`);
    console.log(`roomIdOk: ${!!roomIdOk}`);
    console.log(`tempMessageIdOk: ${!!tempMessageIdOk}`);
  }

  if (textOk && wordsOk && roomIdOk && tempMessageIdOk) {
    return {
      validatedText: validatedText,
      validatedRoomId: validatedRoomId,
      validatedTempMessageId: validatedTempMessageId,
    };
  } else {
    return undefined;
  }
}

//exports
module.exports = {
  userData: userData,
  message: message,
  minUserNameLength: minUserNameLength,
  maxUserNameLength: maxUserNameLength,
  minPasswordLength: minPasswordLength,
};
