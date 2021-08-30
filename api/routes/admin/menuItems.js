const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../../models/menuItem');
const { validJWTNeeded } = require("../../helpers/auth.helpers");

router.get('/', validJWTNeeded, async (req, res, next) => {
    const match = {};

    if (req.query.menuId) {
        match.menuIds = req.query.menuId;
    }

    try {
        const result = await MenuItem.find(match)
            .populate('menuIds')
            .populate('typeArticle')
            .populate('typeCategory')
            .populate('typeDropDown')
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get('/:menuItemId', validJWTNeeded, (req, res, next) => {
    const id = req.params.menuItemId;

    MenuItem.findById(id)
        .populate('menuIds')
        .populate('typeArticle')
        .populate('typeCategory')
        .populate('typeDropDown')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ error: 'No valid entry for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/insert', validJWTNeeded, async (req, res, next) => {

    let data = {
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        menuIds: [req.body.menuIds],
        datePosted: new Date(),
    };

    if (req.body.typeArticle) {
        data.typeArticle = req.body.typeArticle;
    }

    if (req.body.typeCategory) {
        data.typeCategory = req.body.typeCategory;
    }

    if (req.body.typeDropDown) {
        data.typeDropDown = req.body.typeDropDown;
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

router.post('/update/:menuItemId', validJWTNeeded, async (req, res, next) => {
    const id = req.params.menuItemId;

    if (req.body.typeDropDown) {
        let index = req.body.typeDropDown.indexOf(id);
        if (index !== -1) {
            return res.status(500).json({ error: "Dropdown cannot have itself as a child" });
        }
    }

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

router.post('/delete', validJWTNeeded, async (req, res, next) => {

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