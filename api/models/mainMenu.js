const mongoose = require('mongoose');

const mainMenuSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu'},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('MainMenu', mainMenuSchema);