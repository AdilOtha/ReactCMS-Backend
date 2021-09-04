const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../../models/category');
const { validJWTNeeded } = require("../../helpers/auth.helpers");

router.get('/', validJWTNeeded, async (req, res) => {
    const match = {};
    if(req.jwt?._id) {
        match.userId = req.jwt?._id;
    }
    try {
        const result = await Category.find(match)
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get('/:categoryId', validJWTNeeded, (req, res) => {
    const id = req.params.categoryId;

    const match = {};

    if(req.jwt?._id) {
        match.userId = req.jwt?._id;
    }

    if(id) {
        match._id= id;
    }

    Category.find(match)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid entry for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/insert', validJWTNeeded, async (req, res) => {
    let userId;
    if(req.jwt?._id) {
        userId = req.jwt._id;
    }
    const category = new Category({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        datePosted: new Date(),
        userId: userId,
    });

    try {
        const result = await category.save();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.post('/update/:categoryId', validJWTNeeded, async (req, res) => {
    const id = req.params.categoryId;

    const match = {};

    if(req.jwt?._id) {
        match.userId = req.jwt?._id;
    }

    if(id) {
        match._id= id;
    }

    try {
        const result = await Category.updateMany(match, { $set: req.body }).exec()
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

router.post('/delete', validJWTNeeded, async (req, res) => {

    const categoryIds = req.body.categoryIds;

    const match ={};
    if(req.jwt?._id) {
        match.userId = req.jwt?._id;
    }
    if(categoryIds.length>0) {
        match._id = { $in: categoryIds };
    }

    try {
        const result = await Category.deleteMany(match).exec();
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }

});

module.exports = router;