const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number already exists"],
      trim: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
      trim: true,
    },
    createdOn: {
      type: Date,
      expires: 60, // expires in 1 minute
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "otp",
  }
);

module.exports =mongoose.model("otp", otpSchema);
