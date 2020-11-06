const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour-controller');
const authController = require('../controllers/auth-controller');
const reviewRouter = require('../routes/review-routes');

// Redirecting to review router in case of nested route
router.use('/:tourId/reviews', reviewRouter);

// Special routes
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(
    authController.protect, 
    authController.restrictTo('admin', 'lead guide', 'guide'),
    tourController.getMonthlyPlan
);

// Main routes
router.route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'lead guide'),
        tourController.addTour
    );

router.route('/:id')
    .get(tourController.getSingleTour)
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'lead guide'),
        tourController.updateTour
    )
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.deleteTour
    );

module.exports = router;