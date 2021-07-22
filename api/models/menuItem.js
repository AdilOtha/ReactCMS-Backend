const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    typeArticle: {type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    typeCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
});

module.exports = mongoose.model('MenuItem', menuItemSchema);