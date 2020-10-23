const Review = require('../models/reviewModel');
const APIfeatures = require('../utils/apiFeatures');

exports.getAllReviews = async (req,res,next) => {
    try {
        const features = new APIfeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        
        const reviews = await features.query;
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
        const newReview = new Review.create(newReviewData);
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