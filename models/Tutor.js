const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Path simple rakhein

router.get('/', async (req, res) => {
  try {
    // Sirf User model se teachers nikalna kafi hai
    const teachers = await User.find({ role: 'teacher' });
    
    console.log("✅ Teachers found:", teachers.length);
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;