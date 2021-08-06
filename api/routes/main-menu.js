const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const MainMenu = require('../models/main-menu');

router.get('/', async (req, res, next) => {
    try {
        const result = await MainMenu.find()
            .populate('menuId')
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.post('/', async () => {
    try {
        const result = await MainMenu.find().exec();
        const result2 = await MainMenu.updateOne({ _id: result._id }, { $set: req.body }).exec()
        res.status(200).json(result2);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});