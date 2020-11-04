const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/me', 
    authController.protect,
    userController.getMe,
    userController.getSingleUser
);

router.patch('/updatePassword', 
    authController.protect, 
    authController.updatePassword
);

router.patch('/updateMe', 
    authController.protect, 
    userController.updateMe
);

router.patch('/deleteMe', 
    authController.protect, 
    userController.deleteMe
);

router.route('/')
    .get(userController.getAllUsers)

router.route('/:id')
    .get(userController.getSingleUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;