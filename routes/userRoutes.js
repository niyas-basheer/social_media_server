const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByUid,
  loginWithOtp,
  requestOtp,
  updateUser,
} = require("../controllers/userController");

// Create User, Get All Users
router.route("/users").post(createUser).get(getAllUsers)

// Get Single User by UID, Update User, Delete User
router.route("/users/:uid").get(getUserByUid).put(updateUser).delete(deleteUser)

// Request OTP for login
router.post("/request_otp", requestOtp);

//Resend OTP 
router.post("/resend_otp", resendOtp);

// Login with OTP
router.post("/login_with_otp", loginWithOtp);

module.exports = router;
