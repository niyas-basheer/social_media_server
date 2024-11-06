const crypto = require('crypto');

// Generates a random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Sends OTP to the phone (implement this using your SMS provider, e.g., Twilio)
const sendOtp = (phone, otp) => {
    // Use Twilio or another SMS service to send the OTP
    console.log(`Sending OTP ${otp} to phone number ${phone}`);
    // Implement your SMS sending logic here
};

module.exports = { generateOtp, sendOtp };

