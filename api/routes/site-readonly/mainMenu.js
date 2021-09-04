const express = require('express');
const router = express.Router();
const MainMenu = require('../../models/mainMenu');
const { validJWTNeededForSite } = require('../../helpers/auth.helpers');
const MenuItem = require('../../models/menuItem');

router.get('/', validJWTNeededForSite, async (req, res) => {
    try {
        const result = await MainMenu.findOne()
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get('/getMainMenuItems', async (req, res) => {
    const match = {};
    if (req.body.userId) {
        match.userId = req.body.userId;
    }
    try {
        const result = await MainMenu.findOne(match)
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
                .populate('typeDropDown')
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

module.exports = router;