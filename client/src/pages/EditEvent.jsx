import React,
{useState,useEffect}
from 'react';

import {
useParams,
useNavigate
}
from 'react-router-dom';

import api from '../api/axios';

function EditEvent(){

const {id}=useParams();

const navigate=
useNavigate();

const [formData,setFormData]=
useState({
title:'',
description:'',
date:'',
location:'',
category:'',
image:''
});

useEffect(()=>{

const loadEvent=async()=>{

const res=
await api.get(
`/api/events/${id}`
);

setFormData({
...res.data,
date:res.data.date.slice(0,16)
});

};

loadEvent();

},[id]);


const handleChange=(e)=>{

setFormData({
...formData,
[e.target.name]:
e.target.value
});

};


const handleSubmit=
async(e)=>{

e.preventDefault();

await api.put(
`/api/events/${id}`,
formData
);

navigate('/');

};



return(

<div
style={{
maxWidth:'700px',
margin:'50px auto',
padding:'35px',
background:'#111827',
borderRadius:'18px',
color:'white'
}}
>

<h2 style={{textAlign:'center'}}>
Edit Event
</h2>

<form onSubmit={handleSubmit}>

<input
name="title"
value={formData.title}
onChange={handleChange}
style={inputStyle}
/>

<textarea
name="description"
value={formData.description}
onChange={handleChange}
style={inputStyle}
/>

<input
type="datetime-local"
name="date"
value={formData.date}
onChange={handleChange}
style={inputStyle}
/>

<input
name="location"
value={formData.location}
onChange={handleChange}
style={inputStyle}
/>

<select
name="category"
value={formData.category}
onChange={handleChange}
style={inputStyle}
>
<option>Conference</option>
<option>Workshop</option>
<option>Social</option>
<option>Other</option>
</select>

<input
name="image"
value={formData.image}
onChange={handleChange}
style={inputStyle}
/>

<button style={btnStyle}>
Update Event
</button>

</form>

</div>

);

}

const inputStyle={
width:'100%',
padding:'14px',
margin:'14px 0',
borderRadius:'10px'
};

const btnStyle={
width:'100%',
padding:'14px',
background:'#2563eb',
color:'white',
border:'none',
borderRadius:'10px'
};

export default EditEvent;