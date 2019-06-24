const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  password: String,
  email: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("users", UserSchema);
