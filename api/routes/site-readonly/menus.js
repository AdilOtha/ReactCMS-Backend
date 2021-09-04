const express = require('express');
const router = express.Router();
const Menu = require('../../models/menu');
const MenuItem = require('../../models/menuItem');
const { validJWTNeededForSite } = require('../../helpers/auth.helpers');

router.get('/', validJWTNeededForSite, async (req, res, next) => {
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

router.get('/main-menu/:mainMenuId', validJWTNeededForSite, async (req, res, next) => {
    const id = req.params.mainMenuId;

    try {
        const result = await MenuItem.find({ menuIds: id })
            .populate('typeArticle')
            .populate('typeCategory')
            .populate('typeDropDown')
            .exec();
        // console.log(result);
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

module.exports = router;