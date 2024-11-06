const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jsonParser = express.json();

// Create User
router.post('/users', userController.createUser);

// Get All Users
router.get('/users', userController.getAllUsers);

// Get Single User by UID
router.get('/users/:uid', userController.getUserByUid);

// Update User
router.put('/users/:uid', userController.updateUser);

// Delete User
router.delete('/users/:uid', userController.deleteUser);

// Request OTP for login
router.post('/request_otp', jsonParser, userController.requestOtp);

// Login with OTP
router.post('/login_with_otp', jsonParser, userController.loginWithOtp);

module.exports = router;
