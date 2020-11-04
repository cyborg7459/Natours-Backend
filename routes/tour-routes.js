const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour-controller');
const authController = require('../controllers/auth-controller');
const reviewController = require('../controllers/review-controller');

router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.addTour);

router.route('/:id')
    .get(tourController.getSingleTour)
    .patch(tourController.updateTour)
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.deleteTour
    );

router.route('/:tourId/reviews')
    .post(
        authController.protect, 
        authController.restrictTo('user'), 
        reviewController.createReview
    );

module.exports = router;