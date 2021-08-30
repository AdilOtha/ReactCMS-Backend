const express = require('express');
const router = express.Router();
const MenuItem = require('../../models/menuItem');
const { validJWTNeededForSite } = require('../../helpers/auth.helpers');

router.get('/', validJWTNeededForSite, async (req, res, next) => {
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

module.exports = router;