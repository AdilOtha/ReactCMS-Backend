const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../models/menuItem');

router.get('/', async (req, res, next) => {
    try {
        const result = await MenuItem.find()
            .populate('menuIds')
            .populate('typeArticle')
            .populate('typeCategory')
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get('/:menuItemId', (req, res, next) => {
    const id = req.params.menuItemId;

    MenuItem.findById(id)
        .populate('menuIds')
        .populate('typeArticle')
        .populate('typeCategory')
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

    let data = {
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        menuIds: [],
        datePosted: new Date(),
    };

    data.menuIds.push(req.body.menuIds);

    if (req.body.typeArticle) {
        data.typeArticle = req.body.typeArticle;
    }

    if (req.body.typeCategory) {
        data.typeCategory = req.body.typeCategory;
    }

    const menuItem = new MenuItem(data);

    try {
        const result = await menuItem.save();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.post('/update/:menuItemId', async (req, res, next) => {
    const id = req.params.menuItemId;

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

    try {
        if (!req.body.menuItemIds) {
            throw new Error("Please provide appropriate parameters");
        }

        const result = await MenuItem.deleteMany({
            _id: { $in: req.body.menuItemIds }
        }).exec();

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }

});

module.exports = router;