import React, {
  useEffect,
  useState
} from 'react';

import {
  useParams,
  Link
} from 'react-router-dom';

import api from '../api/axios';

import {
  useAuth
} from '../context/AuthContext';


function EventDetails() {

  const { id } = useParams();

  const { user } = useAuth();

  const [event, setEvent] = useState(null);

  const [message, setMessage] = useState('');


  useEffect(() => {
    loadEvent();
  }, []);


  const loadEvent = async () => {

    try {

      const res =
        await api.get(
          `/api/events/${id}`
        );

      setEvent(res.data);

    } catch (err) {

      console.error(err);

    }

  };



  const handleRegister = async () => {

    try {

      const res =
        await api.post(
          `/api/events/${id}/register`
        );

      setEvent(res.data);

      setMessage(
        '✅ Registered successfully'
      );

    }
    catch (err) {

      setMessage(
        err.response?.data?.error ||
        'Registration failed'
      );

    }

  };



  if (!event) {

    return (
      <div style={loadingStyle}>
        Loading...
      </div>
    );

  }



  const isOwner =
    user &&
    event.organizer &&
    user.id === event.organizer._id;


  const alreadyRegistered =
    user &&
    event.attendees?.some(
      a => a._id === user.id
    );



  return (

    <div style={pageStyle}>

      <div style={cardStyle}>

        {/* Hero Image */}
        <div style={imageWrapperStyle}>
          <img
            src={
              event.image ||
              'https://via.placeholder.com/1000'
            }
            alt="event"
            style={imageStyle}
          />
        </div>


        {/* Title */}
        <h1 style={titleStyle}>
          {event.title}
        </h1>


        {/* Info Badges */}
        <div style={badgeRowStyle}>

          <span style={badgeStyle}>
            📍 {event.location}
          </span>

          <span style={badgeStyle}>
            🏷 {event.category}
          </span>

          <span style={badgeStyle}>
            👥 {event.attendees.length} Attendees
          </span>

        </div>


        {/* Description */}
        <div style={sectionStyle}>

          <h3 style={sectionHeadingStyle}>
            About Event
          </h3>

          <p style={descStyle}>
            {event.description}
          </p>

        </div>


        {/* Success/Error Message */}
        {message && (
          <div style={messageStyle}>
            {message}
          </div>
        )}



        {/* Action Buttons */}
        <div style={buttonRowStyle}>

          {
            !isOwner &&
            user &&
            !alreadyRegistered && (

              <button
                onClick={handleRegister}
                style={registerBtnStyle}
              >
                Register Now
              </button>

            )
          }


          {
            alreadyRegistered && (
              <div style={registeredStyle}>
                Already Registered
              </div>
            )
          }


          {
            isOwner && (
              <Link
                to={`/edit-event/${event._id}`}
                style={editBtnStyle}
              >
                ✏ Edit Event
              </Link>
            )
          }

        </div>



        {/* Attendees */}
        <div style={sectionStyle}>

          <h3 style={sectionHeadingStyle}>
            Attendees
          </h3>

          <div style={attendeeGridStyle}>

            {
              event.attendees.map(
                person => (

                  <div
                    key={person._id}
                    style={attendeeCardStyle}
                  >

                    <div style={avatarStyle}>
                      {
                        person.username
                          .charAt(0)
                          .toUpperCase()
                      }
                    </div>

                    <span>
                      {person.username}
                    </span>

                  </div>

                )
              )
            }

          </div>

        </div>

      </div>

    </div>

  );

}

export default EventDetails;



/* -------------------------
   STYLES
-------------------------- */

const pageStyle = {
  maxWidth: '1100px',
  margin: '50px auto',
  padding: '20px'
};

const cardStyle = {
  background:
    'linear-gradient(145deg,#111827,#0f172a)',
  borderRadius: '24px',
  padding: '35px',
  boxShadow:
    '0 0 30px rgba(0,0,0,.35)',
  color: 'white'
};

const imageWrapperStyle = {
  overflow: 'hidden',
  borderRadius: '18px',
  marginBottom: '30px'
};

const imageStyle = {
  width: '100%',
  height: '420px',
  objectFit: 'cover'
};

const titleStyle = {
  fontSize: '48px',
  fontWeight: '700',
  marginBottom: '25px'
};

const badgeRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '30px'
};

const badgeStyle = {
  background: '#1e293b',
  padding: '10px 16px',
  borderRadius: '30px'
};

const sectionStyle = {
  marginTop: '30px'
};

const sectionHeadingStyle = {
  fontSize: '28px',
  marginBottom: '16px'
};

const descStyle = {
  lineHeight: '1.8',
  fontSize: '17px',
  color: '#d1d5db'
};

const buttonRowStyle = {
  display: 'flex',
  gap: '15px',
  marginTop: '30px',
  flexWrap: 'wrap'
};

const registerBtnStyle = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '14px 24px',
  borderRadius: '12px',
  fontSize: '16px',
  cursor: 'pointer'
};

const editBtnStyle = {
  background: '#7c3aed',
  color: 'white',
  padding: '14px 24px',
  borderRadius: '12px',
  textDecoration: 'none'
};

const registeredStyle = {
  background: '#065f46',
  padding: '14px 22px',
  borderRadius: '12px'
};

const messageStyle = {
  marginTop: '20px',
  background: '#1d4ed8',
  padding: '14px',
  borderRadius: '10px'
};

const attendeeGridStyle = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit,minmax(220px,1fr))',
  gap: '18px'
};

const attendeeCardStyle = {
  background: '#1e293b',
  padding: '18px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const avatarStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  background: '#2563eb',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold'
};

const loadingStyle = {
  color: 'white',
  textAlign: 'center',
  marginTop: '100px'
};