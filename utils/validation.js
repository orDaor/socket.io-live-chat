//minumum user input lengths (excluded extra spaces)
const minPasswordLength = 5;
const minUserNameLength = 5;
const maxUserNameLength = 20;

//sign up input validation
function userInput(userInput, loggingEnabled = false) {
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

//exports
module.exports = {
  userInput: userInput,
  minUserNameLength: minUserNameLength,
  maxUserNameLength: maxUserNameLength,
  minPasswordLength: minPasswordLength,
};
