const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require("twilio")(accountSid, authToken);

let OTP, user;

authRouter.post("/signup", async (req, res) => {
  try {
    const { number } = req.body;
    const existingUser = await User.findOne({ number });
    if (existingUser) {
      return res.status(400).json({ msg: "User with same number already exists! Please check" });
    }
    
    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    await client.messages
      .create({
        body: `Your otp verification is ${OTP}`,
        messagingServiceSid: "MGcaf7f03405c93b25d9dddf43571e1960",
        to: number
      })
      .then(() => res.status(200).json({ msg: "Message Sent" }))
      .done();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
let signinUser;
authRouter.post("signin",async (req, res)=>{
    try {
       const{number}=req.body;
       signinUser = await User.findOne({number});
       if (!signinUser) {
        return res.status(400).json({msg:"This number does not Exists!!!"});
       } 

       let digits = "0123456789";
       OTP = "";
       for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random()*10)];
       }
    } catch (error) {
        
    }
})


authRouter.post("/signin/verify", async (req, res)=> {

try{
const {otp} = req.body;
if (otp !=OTP) {
   return res.status(400).json({msg:"Incorrect Otp"}) 
}
const token = jwt.sign({id: signinUser._id},"passwordKey");
res.status(200).json({token, ...signinUser._doc});
OTP="";
}catch(e){
    res.status(500).json({error:e.message});
}
});
