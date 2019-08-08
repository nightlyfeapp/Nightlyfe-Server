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
  eventDate: {
    type: Date,
    required: true,
  },
  eventTime: {
    type: Date,
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    areaCode: {
      type: String,
      required: true,
    },
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
