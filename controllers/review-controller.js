const Review = require('../models/reviewModel');
const appError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserID = (req,res,next) => {
    if(!req.body.byUser)
        req.body.byUser = req.user._id;
    if(!req.body.forTour)
        req.body.forTour = req.params.tourId;
    next();
}

exports.authorizeUpdateAndDelete = async (req,res,next) => {
    if(req.user.role === 'user') {
        const review = await Review.findById(req.params.id);
        if(!review.byUser._id.equals(req.user._id))
            next(new appError('You are not allowed to change or delete another user\'s review', 403));
    }
    next();
}

exports.getAllReviews = factory.getAll(Review);
exports.getSingleReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);