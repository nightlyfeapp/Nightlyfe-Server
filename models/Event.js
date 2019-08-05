/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
/* eslint-disable consistent-return */
/* eslint-disable func-names */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  timeOfEvent: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = Event = mongoose.model('Event', EventSchema);
