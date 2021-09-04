const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    
    title: {type: String, required: true},
    body: {type: Object, required: true},
    datePosted: {type: Date, required: true},
    published: {type: Boolean, required: true},
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    noOfLikes: {type: Number, default: 0},
    noOfComments: {type: Number, default: 0},
});

module.exports = mongoose.model('Article', articleSchema);