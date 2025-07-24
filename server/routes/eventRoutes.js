const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create event
// server/routes/eventRoutes.js
router.post('/', auth, async (req, res) => {
  try {
    // Convert date string to Date object
    const eventData = {
      ...req.body,
      date: new Date(req.body.date),
      organizer: req.user.id
    };
    
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// server/routes/eventRoutes.js
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username')
      .populate('attendees', 'username');
    
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'username');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already registered' });
    }
    
    event.attendees.push(req.user.id);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
