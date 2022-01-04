const express = require('express');
const router = express.Router();
const Article = require('../../models/article');
const Comment = require('../../models/comment');
const { validJWTNeededForSite } = require('../../helpers/auth.helpers');

router.get('/', validJWTNeededForSite, (req, res) => {
    const match = {};
    const sort = { datePosted: -1 };

    if (req.query.published) {
        match.published = req.query.published;
    }

    let userId = null;
    if (req.jwt && req.jwt._id) {
        userId = req.jwt._id;
    }
    console.log(userId);

    Article.find(match,
        {
            title: 1,
            datePosted: 1,
            noOfLikes: 1,
            noOfComments: 1,
            likes: {
                $elemMatch: { $eq: userId }
            }
        },
        {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort,
        })
        .populate('userId')
        .populate("categoryIds")
        .populate('likes')
        .exec()
        .then(async (docs) => {            
            try {
                const count = match === {} ? await Article.countDocuments().exec()
                : await Article.countDocuments(match).exec();
                for(const doc of docs) {
                    const noOfComments = await Comment.countDocuments({ articleId: doc._id });
                    doc.noOfComments = noOfComments;
                }
                const response = {
                    count,
                    articles: docs
                }
                return res.status(200).json(response);
            } catch (err) {
                return res.status(500).json({ message: err });
            }            
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(err);
        });
});

router.get('/:articleId', validJWTNeededForSite, (req, res) => {
    const id = req.params.articleId;
    let userId = null;
    if (req.jwt?._id) {
        userId = req.jwt._id;
    }
    Article.findById(id,
        {
            title: 1,
            body: 1,
            datePosted: 1,
            noOfLikes: 1,
            likes: {
                $elemMatch: { $eq: userId }
            }
        })
        .populate('userId')
        .populate('categoryIds')
        .exec()
        .then(async (doc) => {
            console.log(doc);
            if (doc) {
                try {
                    const noOfComments = await Comment.countDocuments({ articleId: doc._id });
                    doc.noOfComments = noOfComments;
                    return res.status(200).json(doc);
                } catch (err) {
                    return res.status(500).json({ message: err });
                }
            } else {
                return res.status(404).json({ message: 'No valid entry for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err });
        });

});

router.post('/like', validJWTNeededForSite, async (req, res) => {
    const articleId = req.body.articleId;
    let userId = null;
    if (req.jwt && req.jwt._id) {
        userId = req.jwt._id;
    }

    try {
        const result = await Article.findOneAndUpdate({ _id: articleId, likes: { $ne: userId } },
            { $inc: { noOfLikes: 1 }, $push: { likes: userId } },
            {
                new: true,
                fields: {
                    title: 1,
                    body: 1,
                    datePosted: 1,
                    noOfLikes: 1,
                    likes: {
                        $elemMatch: { $eq: userId }
                    }
                }
            })
            .populate('userId')
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