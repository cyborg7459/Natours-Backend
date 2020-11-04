const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/auth-controller');

router.route('/').get(reviewController.getAllReviews);

module.exports = router;