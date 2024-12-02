const mongoose = require("mongoose");

const statusImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  type:{
    type:String,
    required:true,
    trim:true
  },
  
  viewers:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]

}, { _id: false });

const statusSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    trim: true,
  },
  useruid: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  profileUrl: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  caption: {
    type: String,
    trim: true,
  },
  stories: [statusImageSchema], 
}, {
  timestamps: true,
  versionKey: false,
});

// Create and export the Status model
module.exports = mongoose.model("Status", statusSchema);
