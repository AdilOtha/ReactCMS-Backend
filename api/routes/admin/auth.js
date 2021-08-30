require('dotenv').config()
const express = require('express');
const { check, validationResult, body } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require("fs");
const path = require('path');
const mongoose = require('mongoose');
const User = require("../../models/user");
const {hasAuthFields, isPasswordAndUserMatch} = require("../../helpers/auth.helpers");

// LOGIN ROUTE
router.post('/login', [hasAuthFields, isPasswordAndUserMatch], (req, res) => {
    // console.log(process.env.ACCESS_TOKEN_SECRET);
    const secret = fs.readFileSync(path.join(__dirname, "..//..//..//jwtRS256.key"));
    let token = jwt.sign({ _id: req._id, email: req.body.email },
        secret,
        {
            algorithm: 'RS256',
            expiresIn: '4h'
        });
    res.json({
        token: token,
        auth: true,
        email: req.body.email,
        fname: req.body.fname,
        lname: req.body.lname,
        expiresIn: 14400
    });
});

// REGISTER ROUTE
router.post('/register', [
    check('email').isEmail().notEmpty().withMessage('Please provide an email')
        .normalizeEmail({ all_lowercase: true }),
    check('password').escape().trim().notEmpty().withMessage('Please provide a password')
        .isLength({ min: 6 }).withMessage("Password must be 6 characters long"),
    body('email').custom((value) => {
        return new Promise(async (resolve, reject) => {
            const email = value;
            let results = [];
            try {
                results = await User.find({ email }).exec();
            } catch (err) {
                console.log(err);
            }
            if (results.length === 0) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    }).withMessage("Username already exists")
], async (req, res) => {
    // console.log(req);
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {

        let email = req.body.email;
        let password = await bcrypt.hash(req.body.password, 10);
        let fname = req.body.fname;
        let lname = req.body.lname;

        const newUser = new User({
            _id: new mongoose.Types.ObjectId,
            email,
            password,
            fname,
            lname,
        });

        let result = null;

        try {
            result = await newUser.save();
        } catch (err) {
            return res.status(500).json({ message: err });
        }
        if (result) {
            const secret = fs.readFileSync(path.join(__dirname, "..//..//..//jwtRS256.key"));
            let token = jwt.sign({ _id: result._id, email: req.body.email },
                secret,
                {
                    algorithm: 'RS256',
                    expiresIn: '4h'
                });
            return res.json({
                token: token,
                auth: true,
                email,
                fname,
                lname,
                expiresIn: 14400
            });
        } else {
            return res.status(500).json({
                message: "Registration Failed!"
            });
        }
    }
});

module.exports = router;