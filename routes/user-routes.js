const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Middleware to protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getSingleUser);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.patch('/deleteMe', userController.deleteMe);

// Middleware to restrict all the routes after this to only admins
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router.route('/:id')
    .get(userController.getSingleUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;