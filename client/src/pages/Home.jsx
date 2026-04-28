import React, {
  useEffect,
  useState
} from 'react';

import api from '../api/axios';

import EventCard from '../components/EventCard';

function Home() {

  const [events, setEvents] = useState([]);

  const [filteredEvents, setFilteredEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  const [filters, setFilters] =
    useState({
      search: '',
      category: '',
      date: ''
    });



  /* -----------------------
     Load events once
  ----------------------- */

  useEffect(() => {

    loadEvents();

  }, []);



  const loadEvents = async () => {

    try {

      const res =
        await api.get(
          '/api/events'
        );

      setEvents(res.data);

      setFilteredEvents(
        res.data
      );

    }
    catch (err) {

      console.error(err);

    }
    finally {

      setLoading(false);

    }

  };



  /* -----------------------
     Instant filter
  ----------------------- */

  useEffect(() => {

    let data = [...events];


    // search filter
    if (filters.search.trim()) {

      data = data.filter(
        event =>
          event.title
            .toLowerCase()
            .includes(
              filters.search.toLowerCase()
            )
      );

    }


    // category filter
    if (filters.category) {

      data = data.filter(
        event =>
          event.category ===
          filters.category
      );

    }


    // date filter
    if (filters.date) {

      data = data.filter(
        event => {

          const eventDate =
            new Date(event.date)
              .toISOString()
              .split('T')[0];

          return (
            eventDate ===
            filters.date
          );

        }
      );

    }


    setFilteredEvents(data);

  }, [filters, events]);



  /* -----------------------
     Input changes
  ----------------------- */

  const handleChange = (e) => {

    setFilters({

      ...filters,

      [e.target.name]:
        e.target.value

    });

  };



  const clearFilters = () => {

    setFilters({
      search:'',
      category:'',
      date:''
    });

  };



  if (loading) {

    return (
      <div style={loadingStyle}>
        Loading events...
      </div>
    );

  }



  return (

    <div style={pageStyle}>

      <div style={heroStyle}>

        <h1 style={titleStyle}>
          Discover Amazing Events
        </h1>

        <p style={subtitleStyle}>
          Find and join events
          that match your interests
        </p>



        {/* FILTERS */}
        <div style={filterBoxStyle}>

          <input
            type="text"
            name="search"
            placeholder="Search events..."
            value={filters.search}
            onChange={handleChange}
            style={inputStyle}
          />


          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">
              All Categories
            </option>

            <option value="Conference">
              Conference
            </option>

            <option value="Workshop">
              Workshop
            </option>

            <option value="Social">
              Social
            </option>

            <option value="Other">
              Other
            </option>

          </select>


          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            style={inputStyle}
          />


          <button
            onClick={clearFilters}
            style={clearBtnStyle}
          >
            Clear
          </button>

        </div>


        <div style={countStyle}>
          {filteredEvents.length}
          events found
        </div>

      </div>



      {/* EVENTS */}
      <div style={gridStyle}>

        {
          filteredEvents.length > 0 ? (

            filteredEvents.map(
              event => (

                <EventCard
                  key={event._id}
                  event={event}
                />

              )
            )

          ) : (

            <div style={emptyStyle}>
              No events found
            </div>

          )
        }

      </div>

    </div>

  );

}

export default Home;



/* -------------------
   STYLES
------------------- */

const pageStyle = {
  maxWidth:'1200px',
  margin:'40px auto',
  padding:'20px'
};

const heroStyle = {
  background:
   'linear-gradient(145deg,#111827,#1e3a8a)',
  padding:'35px',
  borderRadius:'22px',
  color:'white',
  marginBottom:'30px'
};

const titleStyle = {
  fontSize:'48px',
  marginBottom:'10px'
};

const subtitleStyle = {
  color:'#d1d5db',
  marginBottom:'30px'
};

const filterBoxStyle = {
  display:'grid',
  gridTemplateColumns:
   '2fr 1fr 1fr auto',
  gap:'14px'
};

const inputStyle = {
  padding:'14px',
  borderRadius:'10px',
  border:'1px solid #334155',
  background:'#0f172a',
  color:'white'
};

const clearBtnStyle = {
  background:'#2563eb',
  color:'white',
  border:'none',
  borderRadius:'10px',
  padding:'14px 20px',
  cursor:'pointer'
};

const countStyle = {
  marginTop:'18px',
  color:'#cbd5e1'
};

const gridStyle = {
  display:'grid',
  gridTemplateColumns:
   'repeat(auto-fit,minmax(280px,1fr))',
  gap:'22px'
};

const emptyStyle = {
  color:'white',
  fontSize:'20px'
};

const loadingStyle = {
  color:'white',
  textAlign:'center',
  marginTop:'100px'
};