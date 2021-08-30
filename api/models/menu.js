const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    datePosted: {type: Date},
    position: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Menu', menuSchema);