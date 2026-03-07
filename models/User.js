const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Check karein 'p' small hai ya capital
    role: { type: String, default: 'student' }
});

module.exports = mongoose.model('User', UserSchema);