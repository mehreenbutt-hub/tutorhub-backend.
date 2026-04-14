const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    }, 
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'student' 
    },
    // --- Updated Fields for Teachers ---
    subject: { 
        type: String, 
        default: "" 
    },
    hourlyRate: { 
        type: String, 
        default: "" 
    },
    experience: { 
        type: String, 
        default: "" 
    },
    rating: { 
        type: String, 
        default: "5.0" 
    },
    image: { 
        type: String, 
        default: "" 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('User', UserSchema);