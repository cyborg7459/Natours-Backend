const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authController = require('../controllers/auth-controller');

router.post('/signup', authController.signup);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.addUser);

router.route('/:id')
    .get(userController.getSingleUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;