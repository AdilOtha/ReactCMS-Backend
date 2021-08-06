const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu'},
});

module.exports = mongoose.model('Menu', menuSchema);