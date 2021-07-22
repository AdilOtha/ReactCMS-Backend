const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = require('../models/article');

router.get('/', (req, res, next) => {
    Article.find()
        .select("title datePosted published userId")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                articles: docs.map(doc => {
                    return {
                        title: doc.title,
                        _id: doc._id,
                        datePosted: doc.datePosted,
                        published: doc.published,
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:articleId', (req, res, next) => {
    const id = req.params.articleId;

    Article.findById(id)
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

router.post('/insert', (req, res, next) => {
    const article = new Article({
        _id: new mongoose.Types.ObjectId,
        title: req.body.title,
        body: req.body.body,
        datePosted: new Date(),
        published: req.body.published,
        userId: req.body.userId
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

router.post('/update/:articleId', async (req, res, next) => {
    const id = req.params.articleId;    

    try {
        const result = await Article.updateMany({ _id: id }, { $set: req.body }).exec()
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

router.post('/delete', async (req, res, next) => {

    const articleIds = req.body.articleIds;

    try {
        const result = await Article.deleteMany({
            _id: {$in: articleIds}
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