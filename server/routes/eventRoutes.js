const express=require('express');

const router=express.Router();

const Event=require('../models/Event');

const auth=require('../middleware/auth');


// existing create
router.post('/',auth,async(req,res)=>{
const event=
new Event({
...req.body,
organizer:req.user.id
});

await event.save();

res.json(event);
});


// all events
router.get('/',async(req,res)=>{
const events=
await Event.find();
res.json(events);
});


// one event
router.get('/:id',async(req,res)=>{
const event=
await Event.findById(
req.params.id
);

res.json(event);
});


// UPDATE EVENT
router.put(
'/:id',
auth,
async(req,res)=>{

const event=
await Event.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

res.json(event);

}
);


// DELETE EVENT
router.delete(
'/:id',
auth,
async(req,res)=>{

await Event.findByIdAndDelete(
req.params.id
);

res.json({
msg:'Deleted'
});

}
);


module.exports=router;