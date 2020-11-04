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

exports.setTourUserID = (req,res,next) => {
    if(!req.body.byUser)
        req.body.byUser = req.user._id;
    if(!req.body.forTour)
        req.body.forTour = req.params.tourId;
    next();
}

exports.getSingleReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);