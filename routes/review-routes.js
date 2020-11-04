const express = require('express');
const router = express.Router({mergeParams: true});
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.setTourUserID,
        reviewController.createReview
    )

router.route('/:id')
    .get(reviewController.getSingleReview)
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;