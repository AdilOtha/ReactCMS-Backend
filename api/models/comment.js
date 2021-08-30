const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    articleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    datePosted: Date,
    content: {type: String, required: true},
});

module.exports = mongoose.model('Comment', commentSchema);