const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

description:{
type:String,
required:true
},

date:{
type:Date,
required:true,
validate:{
validator:function(v){
return v > new Date();
},
message:'Event date must be in future'
}
},

location:{
type:String,
required:true
},

category:{
type:String,
enum:[
'Conference',
'Workshop',
'Social',
'Other'
],
default:'Conference'
},

// NEW IMAGE FIELD
image:{
type:String,
default:''
},

organizer:{
type:mongoose.Schema.Types.ObjectId,
ref:'User'
},

attendees:[
{
type:mongoose.Schema.Types.ObjectId,
ref:'User'
}
],

createdAt:{
type:Date,
default:Date.now
}

});

eventSchema.index({
title:'text',
description:'text',
location:'text'
});

module.exports=
mongoose.model(
'Event',
eventSchema
);