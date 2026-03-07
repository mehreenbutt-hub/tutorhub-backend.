const express = require('express');
const router = express.Router();
const path = require('path'); // Path module shamil kiya

// Ye line ab har surat mein models folder ko dhoond legi
const Tutor = require(path.join(__dirname, '../models/Tutor'));

// Sab tutors lane ka rasta
router.get('/', async (req, res) => {
  try {
    const tutors = await Tutor.find();
    console.log("✅ Database se data mil gaya:", tutors);
    res.json(tutors);
  } catch (err) {
    console.error("❌ Data lane mein masla:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;