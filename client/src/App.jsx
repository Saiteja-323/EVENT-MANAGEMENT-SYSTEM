import React from 'react';

import {
BrowserRouter as Router,
Routes,
Route
}
from 'react-router-dom';

import {
AuthProvider
}
from './context/AuthContext';

import Home from './pages/Home';

import CreateEvent
from './pages/CreateEvent';

import EditEvent
from './pages/EditEvent';

import EventDetails
from './pages/EventDetails';

import Login
from './pages/Login';

import Register
from './pages/Register';

import Layout
from './components/Layout';

function App(){

return(

<AuthProvider>

<Router>

<Layout>

<Routes>

<Route
path="/"
element={<Home/>}
/>

<Route
path="/create-event"
element={<CreateEvent/>}
/>

<Route
path="/edit-event/:id"
element={<EditEvent/>}
/>

<Route
path="/events/:id"
element={<EventDetails/>}
/>

<Route
path="/login"
element={<Login/>}
/>

<Route
path="/register"
element={<Register/>}
/>

</Routes>

</Layout>

</Router>

</AuthProvider>

);

}

export default App;