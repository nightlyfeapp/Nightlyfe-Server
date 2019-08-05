/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/User');

// Register a user
const signUp = async (req, res) => {
  const user = await new User();

  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;

  await user.save((err, savedUser) => {
    if (err) {
      console.log(err);
    } else {
      const payload = { subject: savedUser };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP });

      return res.json({ token }).status(200);
    }
  });
};

// Authorizes a registered user
const logIn = async (req, res) => {
  await passport.authenticate('local', (err, user, data) => {
    if (err) {
      console.log(err);
      return res.json(err).status(500);
    }

    if (user) {
      const payload = { subject: user };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP });
      res.json({ token }).status(200);
    } else return res.status(401).json(data);
  })(req, res);
};

module.exports = {
  signUp,
  logIn,
};
