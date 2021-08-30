const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/user');

router.post('/insert', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId,
        email: req.body.username,
        fname: req.body.fname,
        lname: req.body.lname,
        photoUrl: null        
    });

    user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /users",
                createdUser: result
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});

module.exports = router;