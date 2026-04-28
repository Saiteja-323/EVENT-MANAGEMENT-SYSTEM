const express=require('express');

const router=express.Router();

const Event=require('../models/Event');

const auth=require('../middleware/auth');



// CREATE EVENT
router.post('/',auth,async(req,res)=>{

try{

const eventData={

title:req.body.title,

description:req.body.description,

date:new Date(req.body.date),

location:req.body.location,

category:req.body.category,

image:req.body.image, // NEW

organizer:req.user.id

};

const event=
new Event(eventData);

await event.save();

const populatedEvent=
await Event.findById(
event._id
)
.populate('organizer','username');

res.status(201).json(
populatedEvent
);

}
catch(error){

res.status(400).json({
error:error.message
});

}

});



// GET SINGLE EVENT
router.get('/:id',async(req,res)=>{

try{

const event=
await Event.findById(
req.params.id
)
.populate('organizer','username')
.populate('attendees','username');

if(!event){

return res.status(404).json({
msg:'Event not found'
});

}

res.json(event);

}
catch(error){

res.status(500).json({
error:error.message
});

}

});




// GET ALL EVENTS
router.get('/',async(req,res)=>{

try{

const {
category,
date,
search
}=req.query;

const query={};

query.date={
$gte:new Date()
};

if(category){
query.category=category;
}

if(date){

const filterDate=
new Date(date);

const nextDay=
new Date(filterDate);

nextDay.setDate(
filterDate.getDate()+1
);

query.date={
$gte:filterDate,
$lt:nextDay
};

}

if(search){

query.title={
$regex:search,
$options:'i'
};

}

const events=
await Event.find(query)
.sort({date:1})
.populate(
'organizer',
'username'
)
.populate(
'attendees',
'username'
);

res.json(events);

}
catch(error){

res.status(500).json({
error:error.message
});

}

});




// REGISTER FOR EVENT
router.post(
'/:id/register',
auth,
async(req,res)=>{

try{

const event=
await Event.findById(
req.params.id
);

if(!event){

return res.status(404).json({
msg:'Event not found'
});

}

if(
event.attendees.some(
attendee=>
attendee.equals(req.user.id)
)
){

return res.status(400).json({
msg:'Already registered'
});

}

event.attendees.push(
req.user.id
);

await event.save();

const populatedEvent=
await Event.findById(
event._id
)
.populate(
'organizer',
'username'
)
.populate(
'attendees',
'username'
);

res.json(
populatedEvent
);

}
catch(error){

res.status(500).json({
error:error.message
});

}

});

module.exports=router;