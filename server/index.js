const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* -------------------------
   Configuration
------------------------- */

const PORT = process.env.PORT || 5000;

/* -------------------------
   Middleware
------------------------- */

// Allow frontend requests
app.use(cors({
  origin: '*',
  credentials: true
}));

// Parse JSON body
app.use(express.json());

/* -------------------------
   Request Logger
------------------------- */

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* -------------------------
   MongoDB Connection
------------------------- */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
  console.error("❌ Database Connection Error:");
  console.error(err.message);
});

/* -------------------------
   Routes
------------------------- */

app.get('/', (req, res) => {
  res.send("API is running...");
});

// User routes
app.use('/api/users', require('./routes/userRoutes'));

// Event routes
app.use('/api/events', require('./routes/eventRoutes'));

/* -------------------------
   Error Handling Middleware
------------------------- */

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    error: "Internal Server Error"
  });
});

/* -------------------------
   Start Server
------------------------- */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});