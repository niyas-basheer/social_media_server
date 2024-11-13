const User = require("../models/userModel");
const OtpModel = require("../models/OtpModel");
const { generateOtp, sendOtp } = require("../utils/otpHelper");
const randomToken = require("random-token").create(process.env.SECURITY_KEY);

// Controller for creating a user
const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { username, phone,imgURL } = req.body;

    
    const user = await User.findOneAndUpdate(
      { phoneNumber: phone },
      { username, profileUrl: imgURL },
      { new: true, upsert: true } 
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(201).send({success:true,data:user,message:"user profile updated"});
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "Error creating or updating user" });
  }
};


// Controller for getting all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({success:true,data:users,message:"users data retrived"})
  } catch (error) {
    res.status(400).send({ error: "Error fetching users" });
  }
};

// Controller for getting a single user by UID
const getUserByUid = async (req, res) => {
  try {
    const user = await User.findById(req.params.uid);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json({success:true,data:user,message:"user data retrived"})
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

    let otpEntry = await OtpModel.findOne({ phone });

    if (otpEntry) return res.status(403).json("We already sent an OTP.");

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

    if (!otpEntry) return res.status(404).json("OTP Expired");

    if (otpEntry.otp !== otp) return res.status(400).json("Invalid OTP");

    let user = await User.findOne({ phoneNumber: phone });

    if (!user) {
      user = new User({
        username: `user_${phone}`,
        phoneNumber: phone,
        status: "active",
      });

      await user.save();
    }

    user.isOnline = true;
    await user.save();

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json("Error occurred: " + err.message);
  }
};

const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    };
    let otpEntry = await OtpModel.findOne({ phone });

    if (otpEntry) {
      return res.status(429).json({ message: "Please wait before requesting a new OTP" });
    }
    const newotpValue = generateOtp();

    otpEntry = new OtpModel({
      phone,
      otp: newotpValue,
    });

    await otpEntry.save();
    await sendOtp(phone, newotpValue);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error occured:", error);
    res.status(500).json("Error while resending OTP");
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
  resendOtp
};
