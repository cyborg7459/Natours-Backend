const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = async (req,res,next) => {
    try {
        let filter = {};
        if(req.params.tourId) {
            filter = {forTour : req.params.tourId};
        }
        const reviews =  await Review.find(filter);
        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data : {
                reviews
            }
        });
    }
    catch (err) {
        next(err);
    }
}

exports.createReview = async (req,res,next) => {
    try {
        if(!req.body.userId)
            req.body.userId = req.user._id;
        if(!req.body.tourId)
            req.body.tourId = req.params.tourId;
        let newReviewData = {
            review: req.body.review,
            rating: req.body.rating,
            byUser: req.body.userId,
            forTour: req.body.tourId
        }
        const newReview = await Review.create(newReviewData);
        res.status(201).json({
            status: 'success',
            data: {
                review: newReview
            }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);