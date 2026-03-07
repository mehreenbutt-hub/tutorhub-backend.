const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.post('/register', async (req, res) => {
    try {
        // Yahan password add kar diya hai
        const { name, email, password, role } = req.body; 
        
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        
        res.status(201).json({ message: "✅ User Registered Successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Saare users ko dekhne ke liye route
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check karein ke user database mein hai ya nahi
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "❌ User not found!" });
        }

        // 2. Password check karein (Abhi hum saada password check kar rahe hain)
        if (user.password !== password) {
            return res.status(400).json({ message: "❌ Invalid Password!" });
        }

        // Agar sab theek hai
        res.status(200).json({
            message: "✅ Login Successful!",
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;