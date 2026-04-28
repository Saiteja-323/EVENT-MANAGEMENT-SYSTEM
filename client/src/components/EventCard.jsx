import React from 'react';
import {Link} from 'react-router-dom';
import api from '../api/axios';

function EventCard({event}){

const handleDelete=
async()=>{

if(
window.confirm(
"Delete this event?"
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
style={{
width:'100%',
height:'180px',
objectFit:'cover'
}}
/>

<h3>{event.title}</h3>

<p>{event.location}</p>

<div
style={{
display:'flex',
gap:'10px'
}}
>

<Link
to={`/events/${event._id}`}
>
View
</Link>

<Link
to={`/edit-event/${event._id}`}
>
✏ Edit
</Link>

<button
onClick={handleDelete}
style={{
border:'none',
background:'red',
color:'white',
padding:'6px 10px'
}}
>
🗑
</button>

</div>

</div>

);

}

export default EventCard;