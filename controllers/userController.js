const OtpModel = require("../models/OtpModel");
const User = require("../models/userModel");
const { generateOtp, sendOtp } = require("../utils/otpHelper");
const randomToken = require("random-token").create(process.env.SECURITY_KEY);

// Controller for creating a user
const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: "Error creating user" });
  }
};

// Controller for getting all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send({ error: "Error fetching users" });
  }
};

// Controller for getting a single user by UID
const getUserByUid = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: "Error fetching user" });
  }
};

// Controller for updating a user
const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: "Error updating user" });
  }
};

// Controller for deleting a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ uid: req.params.uid });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).send({ error: "Error deleting user" });
  }
};

// Controller for requesting OTP
const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    let user = await User.findOne({ phoneNumber: phone });

    if (user)
      return res.status(400).json({
        msg: "User with the same number already exists! Please check",
      });

    const otpValue = generateOtp();

    otpEntry = new OtpModel({
      phone,
      otp: otpValue,
    });

    await otpEntry.save();
    await sendOtp(phone, otpValue);

    res.json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json("Error occurred: " + err.message);
  }
};

// Controller for logging in with OTP
const loginWithOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const otpEntry = await OtpModel.findOne({ phone });

    if (!otpEntry)
      return res.status(404).json("OTP not found for this phone number.");

    if (otpEntry.otp !== otp) {
      return res.status(400).json("Invalid OTP.");
    }

    if (Date.now() > otpEntry.otpExpiry) {
      return res.status(400).json("OTP Expired");
    }

    otpEntry.otp = null;
    otpEntry.otpExpiry = null;
    await otpEntry.save();

    let user = await User.findOne({ phoneNumber: phone });

    if (!user) {
      user = new User({
        username: `user_${phone}`,
        phoneNumber: phone,
        status: "active",
      });

      await user.save();
    };

    user.isOnline = true;
    await user.save();
    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json("Error occurred: " + err.message);
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
