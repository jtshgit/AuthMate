const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    userId: String, // 'file' or 'folder'
    userName: String,
    path: String,
    userP:{
        type: String,
        default: "../user.jpeg"
    },
    image:{
        type: String,
        default: "../default-thumb.jpg"
    },
    views:{
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notes', fileSchema);