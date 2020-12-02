const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');
const viewController = require('../controllers/view-controller');

router.use(authController.isLoggedIn);
router.get('/', viewController.getOverview);
router.get('/tours/:tourName', viewController.getTour);
router.get('/login', viewController.loginPage);

module.exports = router;