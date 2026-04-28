import React,{useState} from 'react';

import {useNavigate}
from 'react-router-dom';

import api from '../api/axios';

function CreateEvent(){

const navigate=
useNavigate();

const [formData,setFormData]=
useState({

title:'',
description:'',
date:'',
location:'',
category:'Conference',
image:''

});


const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:
e.target.value

});

};



const handleSubmit=async(e)=>{

e.preventDefault();

try{

const res=
await api.post(
'/api/events',
formData
);

navigate(
`/events/${res.data._id}`
);

}
catch(err){

console.log(err);

alert(
'Error creating event'
);

}

};



return(

<div className="container mt-5">

<h2>Create Event</h2>

<form onSubmit={handleSubmit}>


<div>

<label>
Event Title
</label>

<br/>

<input
type="text"
name="title"
value={formData.title}
onChange={handleChange}
required
/>

</div>

<br/>


<div>

<label>
Description
</label>

<br/>

<textarea
name="description"
value={formData.description}
onChange={handleChange}
required
/>

</div>

<br/>


<div>

<label>
Date
</label>

<br/>

<input
type="datetime-local"
name="date"
value={formData.date}
onChange={handleChange}
required
/>

</div>

<br/>


<div>

<label>
Location
</label>

<br/>

<input
type="text"
name="location"
value={formData.location}
onChange={handleChange}
required
/>

</div>

<br/>


<div>

<label>
Category
</label>

<br/>

<select
name="category"
value={formData.category}
onChange={handleChange}
>

<option>
Conference
</option>

<option>
Workshop
</option>

<option>
Social
</option>

<option>
Other
</option>

</select>

</div>

<br/>


<div>

<label>
Event Image URL
</label>

<br/>

<input
type="text"
name="image"
placeholder="Paste image url"
value={formData.image}
onChange={handleChange}
/>

</div>

<br/>


<button type="submit">
Create Event
</button>

</form>

</div>

);

}

export default CreateEvent;