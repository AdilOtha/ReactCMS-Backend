const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../models/menuItem');

router.get('/', async (req, res, next) => {
    try {
        const result = await MenuItem.find()
            .select("_id name")
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get('/:categoryId', (req, res, next) => {
    const id = req.params.categoryId;

    MenuItem.findById(id)
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

router.post('/insert', async (req, res, next) => {
    const category = new MenuItem({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
    });

    try {
        const result = await category.save();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.post('/update/:categoryId', async (req, res, next) => {
    const id = req.params.categoryId;    

    try {
        const result = await MenuItem.updateMany({ _id: id }, { $set: req.body }).exec()
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

router.post('/delete', async (req, res, next) => {

    const categoryIds = req.body.categoryIds;

    try {
        const result = await MenuItem.deleteMany({
            _id: {$in: categoryIds}
        }).exec();
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }

});

module.exports = router;