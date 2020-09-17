const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour-controller');

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.addTour);

router.route('/:id')
    .get(tourController.getSingleTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;