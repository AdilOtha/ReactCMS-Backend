const express = require('express');
const router = express.Router();
const Category = require('../../models/category');
const { validJWTNeededForSite } = require('../../helpers/auth.helpers');

router.get('/', validJWTNeededForSite, async (req, res, next) => {
    try {
        const result = await Category.find()
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

module.exports = router;