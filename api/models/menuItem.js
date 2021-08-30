const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    typeArticle: {type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    typeCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    typeDropDown: [{type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem'}],
    menuIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'}],
    datePosted: {type: Date},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('MenuItem', menuItemSchema);