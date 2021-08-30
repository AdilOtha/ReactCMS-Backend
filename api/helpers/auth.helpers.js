const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../models/user");
const fs = require("fs");
const path = require('path');

const secretPub = fs.readFileSync(path.join(__dirname,"..//..//jwtRS256.key.pub"));

const validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).json({
                    message: "Authentication failed. Please login again."
                });
            } else {
                req.jwt = jwt.verify(authorization[1], secretPub);
                console.log(req.jwt);
                return next();
            }
        } catch (err) {
            return res.status(403).json({
                message: "Authentication failed"
            });
        }
    } else {
        return res.status(401).json({
            message: "No authorization header found."
        });
    }
}

const validJWTNeededForSite = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).json({
                    message: "Authentication failed. Please login again."
                });
            } else {
                req.jwt = jwt.verify(authorization[1], secretPub);
                console.log(req.jwt);
                return next();
            }
        } catch (err) {
            return res.status(403).json({
                message: "Authentication failed"
            });
        }
    } else {
        return next();
    }
}

const hasAuthFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).json({ message: errors.join(',') });
        } else {
            return next();
        }
    } else {
        return res.status(400).json({ message: 'Missing email and password fields' });
    }
}

const isPasswordAndUserMatch = async (req, res, next) => {
    let myPlaintextPassword = req.body.password;
    let myEmail = req.body.email;

    const creds = {
        email: myEmail,
    }

    let results = [];

    try {
        results = await User.find(creds).exec();
    } catch (err) {
        return res.status(500).json({ message: err });
    }

    if (results.length > 0) {
        let match = false;
        try {
            match = await bcrypt.compare(myPlaintextPassword, results[0].password);
        } catch (err) {
            console.log(err);
        }
        if (match) {
            req.email = results[0].email;
            req._id = results[0]._id;
            req.fname = results[0].fname;
            req.lname = results[0].lname;
            next();
        } else {
            return res.status(401).json({
                message: "Username or Password incorrect"
            });
        }
    } else {
        return res.status(401).json({
            message: "Username or Password incorrect"
        });
    }
}

module.exports = {
    validJWTNeeded,
    validJWTNeededForSite,
    hasAuthFields,
    isPasswordAndUserMatch,
}