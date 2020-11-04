const express = require('express');
const router = express.Router({mergeParams: true});
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    )

router.route('/:id')
    .delete(reviewController.deleteReview);

module.exports = router;