/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
/* eslint-disable consistent-return */
/* eslint-disable func-names */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [
      /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/,
      'Must be 6-15 characters long, no special characters allowed.',
    ],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      'Please enter a valid email.',
    ],
  },
  password: {
    type: String,
    required: true,
    // match: [
    //   /"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"/,
    //   'Minimum eight characters, at least one letter, one number and one special character',
    // ],
  },
  eventsCreated: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook thatsalts and hashes User passwords save salt secret string
UserSchema.pre('save', function (next) {
  const user = this;

  // Only hash password if it has been modified or new
  if (!user.isModified('password')) return next();

  // Generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // Hash the password
    // eslint-disable-next-line no-shadow
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      // Override password with hashed one
      user.password = hash;
      user.saltSecret = salt;
      next();
    });
  });
});

// So bcrypt doesnt compare hashed password
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User = mongoose.model('User', UserSchema);
