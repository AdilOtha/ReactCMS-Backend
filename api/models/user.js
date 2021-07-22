const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    fname: String,
    lname: String,
    photoUrl: String
});

module.exports = mongoose.model('User', userSchema);