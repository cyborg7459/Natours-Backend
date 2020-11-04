const Review = require('../models/reviewModel');

exports.getAllReviews = async (req,res,next) => {
    try {
        const reviews =  await Review.find();
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
        let newReviewData = {
            review: req.body.review,
            rating: req.body.rating,
            byUser: req.user._id,
            forTour: req.params.tourId
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