const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const auth = require('../middleware/auth');


/* ----------------------------
   CREATE EVENT
---------------------------- */

router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user.id
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'username')
      .populate('attendees', 'username');

    res.status(201).json(populatedEvent);

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});


/* ----------------------------
   GET ALL EVENTS
---------------------------- */

router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate('organizer', 'username')
      .populate('attendees', 'username');

    res.json(events);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


/* ----------------------------
   GET ONE EVENT
---------------------------- */

router.get('/:id', async (req, res) => {
  try {

    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username')
      .populate('attendees', 'username');

    if (!event) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


/* ----------------------------
   UPDATE EVENT
---------------------------- */

router.put('/:id', auth, async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    // only creator can edit
    if (
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        error: 'Not authorized'
      });
    }

    const updatedEvent =
      await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      .populate('organizer','username')
      .populate('attendees','username');

    res.json(updatedEvent);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


/* ----------------------------
   DELETE EVENT
---------------------------- */

router.delete('/:id', auth, async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error:'Event not found'
      });
    }

    // only creator can delete
    if (
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        error:'Not authorized'
      });
    }

    await Event.findByIdAndDelete(
      req.params.id
    );

    res.json({
      msg:'Deleted'
    });

  } catch (error) {

    res.status(500).json({
      error:error.message
    });

  }

});


/* ----------------------------
   REGISTER FOR EVENT
---------------------------- */

router.post('/:id/register', auth, async (req,res)=>{

try{

const event =
await Event.findById(
req.params.id
);

if(!event){
return res.status(404).json({
error:'Event not found'
});
}


// creator cannot register own event
if(
event.organizer.toString() === req.user.id
){
return res.status(400).json({
error:'Organizer cannot register'
});
}


// prevent duplicate registration
if(
event.attendees.some(
a=>a.toString()===req.user.id
)
){
return res.status(400).json({
error:'Already registered'
});
}


// add attendee
event.attendees.push(
req.user.id
);

await event.save();


// return updated attendees list
const updatedEvent=
await Event.findById(event._id)
.populate('organizer','username')
.populate('attendees','username');


res.json(updatedEvent);

}
catch(error){

res.status(500).json({
error:error.message
});

}

});

module.exports = router;