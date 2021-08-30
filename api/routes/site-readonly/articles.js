const express = require('express');
const router = express.Router();
const Article = require('../../models/article');
const { validJWTNeededForSite } = require('../../helpers/auth.helpers');

router.get('/', validJWTNeededForSite, (req, res) => {
    const match = {};
    const sort = { datePosted: -1 };

    if (req.query.published) {
        match.published = req.query.published;
    }

    let userId = null;
    if(req.jwt && req.jwt._id) {
        userId = req.jwt._id;
    }
    console.log(userId);

    Article.find(match,
        {
            title: 1,
            datePosted: 1,
            noOfLikes: 1,
            likes: {
                $elemMatch: { $eq: userId }
            }
        },
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

router.get('/:articleId', validJWTNeededForSite, (req, res) => {
    const id = req.params.articleId;

    Article.findById(id)
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

router.post('/like', validJWTNeededForSite, async (req, res) => {
    const articleId = req.body.articleId;
    let userId = null;
    if(req.jwt && req.jwt._id) {
        userId = req.jwt._id;
    }

    try {
        const result = await Article.findOneAndUpdate({ _id: articleId, likes: { $ne: userId } },
            { $inc: { noOfLikes: 1 }, $push: { likes: userId } },
            {
                new: true,
                fields: {
                    title: 1,
                    datePosted: 1,
                    noOfLikes: 1,
                    likes: {
                        $elemMatch: { $eq: userId }
                    }
                }
            })
            .populate("categoryIds")
            .exec();
        console.log(result);
        if (result === null) {
            const result2 = await Article.findOneAndUpdate({ _id: articleId, likes: userId },
                { $inc: { noOfLikes: -1 }, $pull: { likes: userId } },
                {
                    new: true,
                    fields: {
                        title: 1,
                        datePosted: 1,
                        noOfLikes: 1,
                        likes: {
                            $elemMatch: { $eq: userId }
                        }
                    }
                })
                .populate("categoryIds")
                .exec();
            return res.status(200).json(result2);
        }
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
});

module.exports = router;