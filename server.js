/* eslint-disable no-console */
// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

require('./config/passport/index');

const eventRoutes = require('./routes/api/eventRoutes');
const authRoutes = require('./routes/api/authRoutes');

require('dotenv').config();

const server = express();

// Middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

server.use(cors());

server.use('/events', eventRoutes);
server.use('/auth', authRoutes);

// Database Connection
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected To Database!');
  })
  .catch((err) => {
    console.log(err);
  });

// Server
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is listening on localhost: ${port}`);
});
