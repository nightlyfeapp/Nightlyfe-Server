/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Event = require('../models/Event');
const User = require('../models/User');

// Create new Event
const newEvent = async (req, res) => {
  // Create instance of new event
  const event = await new Event();

  // Get input data apply it to event model
  event.title = req.body.title;
  event.timeOfEvent = req.body.timeOfEvent;
  event.location = req.body.location;
  event.description = req.body.description;
  event.createdBy = req.user.subject;

  // Save event
  await event
    .save()
    //  Find user
    .then(() => User.findById(req.user.subject._id))
    .catch((err) => {
      console.log(err);
      res.send(err);
    })
    // Associate event with user
    .then((user) => {
      user.eventsCreated.push(event._id);
      user.save();
      console.log('EVENT SAVED!');
      res.json({ event });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

// Gets an Event
const getEvent = async (req, res) => {
  await Event.findById(req.params.eventId).then((event) => {
    console.log('Event Found');
    return res.json({ event }).status(200);
  });
};

// Gets all Events
const allEvents = async (req, res) => {
  await Event.find({}).then((events) => {
    console.log('Events Found');
    return res.json({ events }).status(200);
  });
};

// Updates an Event
const updateEvent = async (req, res) => {
  try {
    // Get the current users id
    const userId = req.user.subject._id;

    // Find the event
    await Event.findById(req.params.eventId)
      // Take the event
      .then((event) => {
        // If users id matches the event creator then continue
        if (userId.toString() === event.createdBy.toString()) {
          // Change event with matching feild inputs
          event.title = req.body.title;
          event.timeOfEvent = req.body.timeOfEvent;
          event.location = req.body.location;
          event.description = req.body.description;

          // Save new event
          event.save((err) => {
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.json({ event }).status(200);
            }
          });
          // Otherwise if the user does not match event creator
        } else {
          // Tell the client their not authorized
          res.json({ message: 'User is not authorized' }).status(401);
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ err }).status(500);
      });
  } catch (err) {
    console.log(err);
    res.json({ err }).status(500);
  }
};

// Deletes an Event
const deleteEvent = async (req, res) => {
  try {
    // Get the current users id
    const userId = req.user.subject._id;

    // Find the event
    Event.findById(req.params.eventId)
      .then((event) => {
        console.log('EVENT ID: ', event._id);
        console.log('USER ID: ', userId);
        // If the user is the creator of the event
        if (userId.toString() === event.createdBy.toString()) {
          // Remove event
          event.remove();

          res.json({ message: 'EVENT DELETED' }).status(200);
          // Otherwise if the user did not create the event
        } else {
          // Tell the client that theyre not authorized
          res.json({ message: 'User is not authorized' }).status(401);
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ err }).status(500);
      });
  } catch (err) {
    console.log(err);
    res.json({ err }).status(500);
  }
};

module.exports = {
  newEvent,
  getEvent,
  allEvents,
  updateEvent,
  deleteEvent,
};
