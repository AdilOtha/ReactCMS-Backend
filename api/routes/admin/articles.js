const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = require('../../models/article');
const { validJWTNeeded } = require("../../helpers/auth.helpers");

router.get('/', validJWTNeeded, (req, res) => {
    const match = {};
    const sort = {};

    if(req.jwt?._id) {
        match.userId = req.jwt?._id;
    }

    if (req.query.published) {
        match.published = req.query.published;
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    Article.find(match,
        null,
        {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort,
        })
        .populate("categoryIds")
        .exec()
        .then(async (docs) => {
            const count = match === {} ? await Article.countDocuments().exec()
                : await Article.countDocuments(match).exec();
            const response = {
                count,
                articles: docs
            }
            return res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(err);
        });
});

router.get('/:articleId', validJWTNeeded, (req, res) => {
    const id = req.params.articleId;
    const match = {};

    if(req.jwt?._id) {
        match.userId = req.jwt?._id;
    }

    if(id) {
        match._id=id;
    }

    Article.find(match)
        .populate('categoryIds')
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

router.post('/insert', validJWTNeeded, (req, res) => {
    let userId;
    if(req.jwt?._id) {
        userId = req.jwt._id;
    }
    const article = new Article({
        _id: new mongoose.Types.ObjectId,
        title: req.body.title,
        body: req.body.body,
        datePosted: new Date(),
        published: req.body.published,
        categoryIds: req.body.categoryIds,
        userId: userId
    });

    article.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                articleCreated: result
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/update/:articleId', validJWTNeeded, async (req, res) => {
    const id = req.params.articleId;
    const match = {};

    if(req.jwt?._id) {
        match.userId = req.jwt?._id;
    }

    if(id) {
        match._id= id;
    }

    try {
        const result = await Article.updateOne(match, { $set: req.body }).exec()
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

router.post('/delete', validJWTNeeded, async (req, res) => {

    const articleIds = req.body.articleIds;

    const match ={};
    if(req.jwt?._id) {
        match.userId = req.jwt?._id;
    }
    if(articleIds.length>0) {
        match._id = { $in: articleIds };
    }

    try {
        const result = await Article.deleteMany(match).exec();
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }

});



module.exports = router;