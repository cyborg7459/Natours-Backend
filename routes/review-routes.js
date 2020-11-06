const express = require('express');
const router = express.Router({mergeParams: true});
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

router.use(authController.protect);

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserID,
        reviewController.createReview
    )

router.route('/:id')
    .get(reviewController.getSingleReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview);

module.exports = router;