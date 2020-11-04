const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserID = (req,res,next) => {
    if(!req.body.byUser)
        req.body.byUser = req.user._id;
    if(!req.body.forTour)
        req.body.forTour = req.params.tourId;
    next();
}

exports.getAllReviews = factory.getAll(Review);
exports.getSingleReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);