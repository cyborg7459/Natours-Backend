const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour-controller');

router.param('id', tourController.checkID);

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody,tourController.addTour);

router.route('/:id')
    .get(tourController.getSingleTour)
    .patch(tourController.updateTour)
    .delete(tourController.updateTour);

module.exports = router;