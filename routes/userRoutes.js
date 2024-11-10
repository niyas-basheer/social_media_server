const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByUid,
  loginWithOtp,
  requestOtp,
  resendOtp,
  updateUser,
} = require("../controllers/userController");
const upload = require("../middleware/upload");

// Create User, Get All Users
router.route("/users").post(upload.single("imgURL"), createUser).get(getAllUsers);

// Get Single User by UID, Update User, Delete User
router.route("/users/:uid").get(getUserByUid).put(updateUser).delete(deleteUser)

// Request OTP for login
router.post("/request_otp", requestOtp);

//Resend OTP 
router.post("/resend_otp", resendOtp);

// Login with OTP
router.post("/login_with_otp", loginWithOtp);

module.exports = router;
