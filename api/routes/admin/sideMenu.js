const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SideMenu = require('../../models/sideMenu');
const MenuItem = require('../../models/menuItem');
const { validJWTNeeded } = require("../../helpers/auth.helpers");

router.get('/', validJWTNeeded, async (req, res) => {
    const match = {};
    if (req.jwt?._id) {
        match.userId = req.jwt?._id;
    }
    try {
        const result = await SideMenu.findOne(match)
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
});

router.get('/getSideMenuItems', validJWTNeeded, async (req, res) => {
    const match = {};
    if (req.jwt?._id) {
        match.userId = req.jwt?._id;
    }
    try {
        const result = await SideMenu.findOne(match)
            .exec();
        if (result?.menuId) {
            const match2 = {};
            if (req.jwt?._id) {
                match2.userId = req.jwt?._id;
            }
            match2.menuIds = result.menuId;
            const result2 = await MenuItem.find(match2)
                .populate('typeArticle')
                .populate('typeCategory')
                .exec();
            console.log(result2);
            return res.status(200).json(result2);
        } else {
            res.status(200).json(null);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
});

router.post('/', validJWTNeeded, async (req, res) => {
    try {
        console.log(req.body);
        const result = await SideMenu.find().exec();
        console.log(result);

        if (result.length === 0) {
            const sideMenu = new SideMenu({
                _id: new mongoose.Types.ObjectId,
                menuId: req.body.menuId
            });

            console.log(sideMenu);

            try {
                const result2 = await sideMenu.save();
                return res.status(200).json(result2);
            } catch (err) {
                console.log(err);
                return res.status(500).json({ message: err });
            }
        } else {
            try {
                const result2 = await SideMenu.updateOne({ _id: result[0]._id }, { $set: req.body }).exec();
                return res.status(200).json(result2);
            }
            catch {
                console.log(err);
                return res.status(500).json({ message: err });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
});

module.exports = router;