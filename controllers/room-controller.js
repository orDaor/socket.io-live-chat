const User = require("../models/user-model");

//invitation link handling
async function handleInvitationLink(req, res, next) {
  //who is inviting the user who sent this request?
  //Check whether he exists
  const invitationId = req.params.invitationId;

  //look for the user who issued this invitation link
  let inviter;
  let locals = res.locals;
  locals.invitationInfo = {};
  locals.invitationInfo.invitationId = invitationId;
  try {
    inviter = await User.findByInvitationId(invitationId);
  } catch (error) {
    //the user who issued this link was not found, so this link is not valid
    locals.invitationInfo.inviterName = "";
    //response
    res.render("chat");
    return;
  }

  //the user who issued this link was found
  locals.invitationInfo.inviterName = inviter.name;

  //response
  res.render("chat");
}

//exports
module.exports = {
  handleInvitationLink: handleInvitationLink,
};
