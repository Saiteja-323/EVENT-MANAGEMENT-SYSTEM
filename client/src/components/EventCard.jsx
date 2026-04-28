import React from 'react';

import {Link}
from 'react-router-dom';

import {Card}
from 'react-bootstrap';

const EventCard=({event})=>{

const formatDate=(dateString)=>{

const date=
new Date(dateString);

return date.toLocaleDateString(
undefined,
{
year:'numeric',
month:'short',
day:'numeric',
hour:'2-digit',
minute:'2-digit'
}
);

};


return(

<Card className="h-100">

<div
style={{
height:'160px',
backgroundImage:
`url('${
event.image ||
"https://source.unsplash.com/random/600x400/?event"
}')`,
backgroundSize:'cover',
backgroundPosition:'center'
}}
></div>


<Card.Body>

<Card.Title>
{event.title}
</Card.Title>

<p>
{formatDate(event.date)}
</p>

<p>
{event.location}
</p>

<p>
{event.description}
</p>

<Link
to={`/events/${event._id}`}
className="btn btn-primary"
>
View Details
</Link>

</Card.Body>

</Card>

);

};

export default EventCard;