const User = require("../models/user");

module.exports = {
  async postRegister(req, res, next) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email
    });

    await User.register(newUser, req.body.password);

    res.redirect("/");
  }
};
