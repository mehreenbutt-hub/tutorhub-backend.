const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Ye frontend aur backend ke darmiyan connection allow karta hai

// --- ROUTES ---
const authRoutes = require('./routes/auth'); 
const tutorRoutes = require('./routes/Tutor'); 

// Professional Plural Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes); // Ab ye '/api/tutors' ho gaya hai

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected!");
    console.log("🚀 Server Ready on 5000");
  })
  .catch(err => console.log("❌ MongoDB Error:", err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});