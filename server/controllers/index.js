const User = require('../models/user');

module.exports = {
  postRegister(req, res, next) {
    User.register(
      new User({ username: req.body.username, email: req.body.email }),
      req.body.password,
      err => {
        if (err) {
          console.log('error', err);
          return next(err);
        }

        res.redirect('/');
      }
    );
  }
};
