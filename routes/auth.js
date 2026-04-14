const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Booking = require('../models/Booking'); 
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, subject, experience, hourlyRate } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required!" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters!" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please enter a valid email address!" });
        }
        if (role === 'teacher' && !subject) {
            return res.status(400).json({ error: "Please select a subject!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, email,
            password: hashedPassword,
            role, subject, experience, hourlyRate
        });
        await newUser.save();

        res.status(201).json({ 
            message: "User Registered Successfully",
            user: {
                id: newUser._id,
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                subject: newUser.subject,
                experience: newUser.experience,
                hourlyRate: newUser.hourlyRate
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        res.status(200).json({
            message: "Login Successful",
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subject: user.subject,
                experience: user.experience,
                hourlyRate: user.hourlyRate
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET ALL USERS
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. GET SINGLE TEACHER
router.get('/teacher-requests/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Teacher not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. UPDATE PROFILE
router.put('/update/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. BOOK TEACHER
router.post('/book-teacher', async (req, res) => {
    try {
        const { studentId, teacherId, subject, date, time, message } = req.body;

        if (!studentId || !teacherId) {
            return res.status(400).json({ error: "Student and Teacher are required!" });
        }
        if (!date || !time) {
            return res.status(400).json({ error: "Date and time are required!" });
        }

        const newBooking = new Booking({
            studentId,
            teacherId,
            subject: subject || "General",
            date,
            time,
            message: message || ""
        });
        await newBooking.save();
        res.status(200).json({ message: "Booking request sent successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. GET BOOKINGS
router.get('/bookings', async (req, res) => {
    try {
        const { userId, role } = req.query;
        let bookings;

        if (role === 'admin') {
            bookings = await Booking.find()
                .populate('studentId', 'name email')
                .populate('teacherId', 'name subject');
        } else if (role === 'teacher' || role === 'tutor') {
            bookings = await Booking.find({ teacherId: userId })
                .populate('studentId', 'name email')
                .populate('teacherId', 'name subject');
        } else {
            bookings = await Booking.find({ studentId: userId })
                .populate('studentId', 'name email')
                .populate('teacherId', 'name subject');
        }
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. UPDATE BOOKING STATUS
router.put('/bookings/update/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. DELETE USER
router.delete('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. SEND MESSAGE
router.post('/messages/send', async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();
        res.status(200).json({ message: "Message sent successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 11. GET MESSAGES
router.get('/messages/:userId/:otherUserId', async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;