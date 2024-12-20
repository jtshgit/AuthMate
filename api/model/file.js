const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    type: String, // 'file' or 'folder'
    path: String,
    note: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema);