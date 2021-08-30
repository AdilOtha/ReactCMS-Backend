const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MainMenu = require('../../models/mainMenu');
const { validJWTNeeded } = require("../../helpers/auth.helpers");

router.get('/', validJWTNeeded, async (req, res, next) => {
    try {
        const result = await MainMenu.findOne()
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.post('/', validJWTNeeded, async (req, res, next) => {
    try {
        console.log(req.body);
        const result = await MainMenu.find().exec();
        console.log(result);

        if (result.length === 0) {
            const mainMenu = new MainMenu({
                _id: new mongoose.Types.ObjectId,
                menuId: req.body.menuId
            });

            console.log(mainMenu);

            try {
                const result2 = await mainMenu.save();
                return res.status(200).json(result2);
            } catch (err) {
                console.log(err);
                return res.status(500).json({ error: err });
            }
        } else {
            try {
                const result2 = await MainMenu.updateOne({ _id: result[0]._id }, { $set: req.body }).exec();
                return res.status(200).json(result2);
            }
            catch {
                console.log(err);
                return res.status(500).json({ error: err });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

module.exports = router;