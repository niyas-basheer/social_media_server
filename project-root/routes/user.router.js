const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user.model');
const { generateOtp, sendOtp } = require('../utils/otpHelper');

require('dotenv').config();
const SECURITY_KEY = process.env.SECURITY_KEY;
const OTP_EXPIRY = 300000; // OTP valid for 5 minutes

// Generates a token for the user
const generateToken = () => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(50);
};

// Request OTP for login
router.post('/request_otp', jsonParser, (req, res) => {
    const { phone } = req.body;
    User.findOne({ phone }, (err, user) => {
        if (err) res.status(500).json("Error occurred.");
        else if (!user) res.status(404).json("User not found.");
        else {
            // Generate OTP and set an expiry time
            const otp = generateOtp();
            const otpExpiry = Date.now() + OTP_EXPIRY;

            user.otp = otp;
            user.otpExpiry = otpExpiry;
            user.save()
                .then(() => {
                    sendOtp(phone, otp);  // Send OTP via SMS using an external service like Twilio
                    res.json({ message: "OTP sent successfully." });
                })
                .catch(err => res.status(500).json("Error: " + err));
        }
    });
});

// Login with OTP
router.post('/login_with_otp', jsonParser, (req, res) => {
    const { phone, otp } = req.body;
    User.findOne({ phone }, (err, user) => {
        if (err) res.status(500).json("Error occurred.");
        else if (!user) res.status(404).json("User not found.");
        else if (user.otp !== otp || Date.now() > user.otpExpiry) {
            res.status(400).json("Invalid or expired OTP.");
        } else {
            // OTP is valid, generate token
            const token = generateToken();
            user.token = token;
            user.otp = null;  // Clear OTP after successful login
            user.otpExpiry = null;

            user.save()
                .then(() => res.json({ message: "Login successful", token }))
                .catch(err => res.status(500).json("Error: " + err));
        }
    });
});

// Utility functions (otpHelper.js)
const crypto = require('crypto');

// Generates a random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Sends OTP to the phone (implement this using your SMS provider, e.g., Twilio)
const sendOtp = (phone, otp) => {
    // Use Twilio or another SMS service to send the OTP
    console.log(`Sending OTP ${otp} to phone number ${phone}`);
    // Your implementation here
};

module.exports = { generateOtp, sendOtp };
