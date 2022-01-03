const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Menu = require('../../models/menu');
const MenuItem = require('../../models/menuItem');
const { validJWTNeeded } = require("../../helpers/auth.helpers");

router.get('/', validJWTNeeded, async (req, res) => {
    try {
        const result = await Menu.find()
            .select("-userId")
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get('/main-menu/:mainMenuId', validJWTNeeded, async (req, res) => {
    const id = req.params.mainMenuId;

    try {
        const result = await MenuItem.find({ menuIds: id })
            .populate('typeArticle')
            .populate('typeCategory')
            .exec();
        console.log(result);
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get('/:menuId', validJWTNeeded, (req, res) => {
    const id = req.params.menuId;

    Menu.findById(id)
        .populate('customSelection.articles customSelection.categories')
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

router.post('/update/:menuId', validJWTNeeded, async (req, res) => {
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

router.post('/delete', validJWTNeeded, async (req, res) => {

    try {
        const result = await Menu.deleteMany({
            _id: { $in: req.body.menuIds }
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