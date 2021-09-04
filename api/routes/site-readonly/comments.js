const express = require('express');
const router = express.Router();
const Comment = require('../../models/comment');
const mongoose = require('mongoose');
const { validJWTNeededForSite } = require('../../helpers/auth.helpers');

router.get('/:articleId', validJWTNeededForSite, async (req, res) => {
    const articleId = req.params.articleId;
    if (articleId) {
        try {
            const result = await Comment.find({ articleId }, null,
                {
                    sort: {
                        datePosted: -1
                    }
                })
                .populate('userId')
                .exec();
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: err });
        }
    } else {
        return res.status(500).json({ message: "Please provide articleId" });
    }
});

router.get('/noOfComments/:articleId', async (req, res) => {
    const articleId = req.params.articleId;
    if (articleId) {
        try {
            const result = await Comment.countDocuments({ articleId })
                .exec();
            return res.status(200).json({_id: articleId,count: result});
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: err });
        }
    } else {
        return res.status(500).json({ message: "Please provide articleId" });
    }
});

router.post('/insert', validJWTNeededForSite, async (req, res) => {
    const comment = new Comment({
        _id: new mongoose.Types.ObjectId,
        content: req.body.content,
        userId: req.jwt._id,
        articleId: req.body.articleId,
        datePosted: new Date(),
    });

    try {
        const result = await comment.save();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
});

module.exports = router;