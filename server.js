require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Atlas Connected Successfully!");
        console.log("📂 Database Name: TutorHub");
    })
    .catch(err => {
        console.error("❌ DB Error:", err.message);
    });

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));