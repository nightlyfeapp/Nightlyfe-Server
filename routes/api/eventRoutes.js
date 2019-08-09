const express = require('express');

const router = express.Router();

const {
  newEvent,
  getEvent,
  allEvents,
  updateEvent,
  deleteEvent,
} = require('../../controllers/events');

const checkAuth = require('../../middleware/auth/checkAuth');

router.route('/new').post(newEvent);

router
  .route('/:eventId')
  .get(getEvent)
  .put(checkAuth, updateEvent)
  .delete(checkAuth, deleteEvent);

router.get('/', allEvents);

module.exports = router;
