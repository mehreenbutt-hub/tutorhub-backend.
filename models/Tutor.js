const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
  name: String,
  subject: String,
  hourlyRate: String,
  experience: String,
  rating: String,
  image: String
});

module.exports = mongoose.model('Tutor', TutorSchema);