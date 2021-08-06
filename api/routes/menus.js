const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Menu = require('../models/menu');

router.get('/', async (req, res, next) => {
    try {
        const result = await Menu.find()
            .select("_id name datePosted")
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get('/:menuId', (req, res, next) => {
    const id = req.params.menuId;

    Menu.findById(id)
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
    const menu = new Menu({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        datePosted: new Date(),
    });

    console.log(menu);

    try {
        const result = await menu.save();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.post('/update/:menuId', async (req, res, next) => {
    const id = req.params.menuId;

    try {
        const result = await Menu.updateMany({ _id: id }, { $set: req.body }).exec()
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
        const result = await Menu.deleteMany({
            _id: {$in: req.body.menuIds}
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