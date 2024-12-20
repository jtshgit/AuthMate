const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, default: '0' },
    password: { type: String, default: '0' },
    otp: { type: String, default: '0' },
    profilePhoto: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
    confirm: { type: Number, default: 0 }, // Default is 0
    date: { type: Date, default: Date.now } // Default is current date and time
});

module.exports = mongoose.model('user', userSchema);
