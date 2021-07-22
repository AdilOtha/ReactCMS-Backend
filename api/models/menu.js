const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    position: String,
});

module.exports = mongoose.model('Menu', menuSchema);