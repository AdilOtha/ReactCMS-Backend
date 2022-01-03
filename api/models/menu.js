const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    datePosted: {type: Date},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    customSelection: {
        articles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
        categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    },
    customFilter: {type: String, default: null}
});

module.exports = mongoose.model('Menu', menuSchema);