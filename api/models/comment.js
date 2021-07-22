const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    articleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: String,    
    datePosted: Date,
    data: String,  
});

module.exports = mongoose.model('Comment', commentSchema);