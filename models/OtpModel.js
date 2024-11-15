const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      expires: "1m",
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =mongoose.model("otp", otpSchema);
