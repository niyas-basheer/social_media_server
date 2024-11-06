const User = require('../models/userModel');
const { generateOtp, sendOtp } = require('../utils/otpHelper');
const randomToken = require('random-token').create(process.env.SECURITY_KEY);

const OTP_EXPIRY = 300000; 

// Controller for creating a user
const createUser = async (req, res) => {
    try {
        console.log(req.body)
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: 'Error creating user' });
    }
};

// Controller for getting all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(400).send({ error: 'Error fetching users' });
    }
};

// Controller for getting a single user by UID
const getUserByUid = async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: 'Error fetching user' });
    }
};

// Controller for updating a user
const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ uid: req.params.uid }, req.body, { new: true });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: 'Error updating user' });
    }
};

// Controller for deleting a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ uid: req.params.uid });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).send({ error: 'Error deleting user' });
    }
};

// Controller for requesting OTP
const requestOtp = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json("User not found.");
        
        // Generate OTP and set an expiry time
        const otp = generateOtp();
        const otpExpiry = Date.now() + OTP_EXPIRY;

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        
        await user.save();
        sendOtp(phone, otp);  // Send OTP via SMS
        res.json({ message: "OTP sent successfully." });
    } catch (err) {
        res.status(500).json("Error occurred: " + err);
    }
};

// Controller for logging in with OTP
const loginWithOtp = async (req, res) => {
    const { phone, otp } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json("User not found.");
        
        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).json("Invalid or expired OTP.");
        }
        
        // OTP is valid, generate token
        const token = randomToken(50);
        user.token = token;
        user.otp = null;  // Clear OTP after successful login
        user.otpExpiry = null;

        await user.save();
        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json("Error occurred: " + err);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByUid,
    updateUser,
    deleteUser,
    requestOtp,
    loginWithOtp,
};
