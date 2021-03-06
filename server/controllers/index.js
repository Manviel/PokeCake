const { OAuth2Client } = require("google-auth-library");

const User = require("../models/user");

const client = new OAuth2Client(process.env.CLIENT_ID);

exports.findOrCreateUser = async token => {
  const googleUser = await verifyAuthToken(token);

  const user = await checkIfUserExists(googleUser.email);

  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
    });
    return ticket.getPayload();
  } catch (err) {
    console.error("Error verifying auth token", err);
  }
};

const checkIfUserExists = async email => await User.findOne({ email });

const createNewUser = googleUser => {
  const user = new User({
    password: googleUser.name,
    email: googleUser.email
  });

  return user.save();
};
