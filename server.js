/* eslint-disable no-console */
// Dependencies
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

require('./config/passport/index');

const eventRoutes = require('./routes/api/eventRoutes');
const authRoutes = require('./routes/api/authRoutes');

require('dotenv').config();

// const corsOptions = {
//   origin: '*',
//   methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
//   allowHeaders: 'X-Requested-With, Content-Type, Accept, Authorization',
//   optionsSuccessStatus: 204,
// };

const allowcrossOrigin = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  );

  // intercept OPTIONS method
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
};

const server = express();

// Middleware
server.use(allowcrossOrigin);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

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
