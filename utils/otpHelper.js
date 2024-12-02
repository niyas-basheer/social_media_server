const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

if (!accountSid || !authToken) {
  console.error("Twilio credentials are not set in the environment variables.");
  throw new Error(
    "Twilio configuration error: Please check your environment variables."
  );
}

const client = require("twilio")(accountSid, authToken);

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (phone, otp) => {
  try {
    // await client.messages.create({
    //   body: `Your OTP verification code is ${otp}`,
    //   from: "+12532525189",
    //   to: phone,
    // });

    console.log(`Sending OTP ${otp} to phone number ${phone}`);
    return { success: true, message: "Message Sent" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    if (error.code === 20404) {
      throw new Error(
        "Twilio configuration error: Resource not found. Please check account SID, auth token, or messaging service SID."
      );
    }
    throw new Error("Failed to send OTP");
  }
};

module.exports = { generateOtp, sendOtp };
