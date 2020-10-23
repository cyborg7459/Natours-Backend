const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

router.route('/').get(reviewController.getAllReviews);
router.route('/:tourId').post(
    authController.protect, 
    authController.restrictTo('user'),
    reviewController.createReview
);

module.exports = router;