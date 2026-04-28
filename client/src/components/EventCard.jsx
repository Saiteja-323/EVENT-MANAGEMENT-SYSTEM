import React from 'react';

import {
Link
} from 'react-router-dom';

import api from '../api/axios';

import {
useAuth
} from '../context/AuthContext';

function EventCard({event}){

const {user}=useAuth();


const isOwner =
user &&
event.organizer &&
user.id===event.organizer._id;



const handleDelete=
async()=>{

if(
window.confirm(
'Delete event?'
)
){

await api.delete(
`/api/events/${event._id}`
);

window.location.reload();

}

};



return(

<div
style={{
border:'1px solid #333',
padding:'15px',
borderRadius:'12px'
}}
>

<img
src={
event.image ||
'https://via.placeholder.com/300'
}
alt="event"
style={{
width:'100%',
height:'180px',
objectFit:'cover'
}}
/>


<h3>
{event.title}
</h3>

<p>
{event.location}
</p>

<p>
👥
{event.attendees.length}
attending
</p>


<div
style={{
display:'flex',
gap:'12px'
}}
>

<Link
to={`/events/${event._id}`}
>
View
</Link>


{
isOwner && (
<>
<Link
to={`/edit-event/${event._id}`}
>
✏ Edit
</Link>

<button
onClick={handleDelete}
style={{
background:'red',
color:'white',
border:'none'
}}
>
🗑
</button>
</>
)
}

</div>

</div>

);

}

export default EventCard;