const Call = require('../models/callModel');
const mongoose = require('mongoose');

// End a call by deleting caller and receiver call entries
exports.endCall = async (req, res) => {
  const { callerId, receiverId } = req.body;
  try {
    await Call.deleteOne({ callerId });
    await Call.deleteOne({ receiverId });
    res.status(200).send({ message: "Call ended successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

// Get call channel ID by user ID
exports.getCallChannelId = async (req, res) => {
  const { uid } = req.params;
  try {
    const call = await Call.findOne({ callerId: uid });
    if (call) {
      res.status(200).send({ callId: call.callId });
    } else {
      res.status(404).send({ callId: "" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

// Get call history for a specific user, ordered by creation date
exports.getMyCallHistory = async (req, res) => {
  const { uid } = req.params;
  try {
    const callHistory = await Call.find({ callerId: uid }).sort({ createdAt: -1 });
    res.status(200).send(callHistory);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

// Get active calls for a user
exports.getUserCalling = async (req, res) => {
  const { uid } = req.params;
  try {
    const calls = await Call.find({ callerId: uid }).limit(1);
    res.status(200).send(calls);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

// Make a call, save data for both caller and receiver
exports.makeCall = async (req, res) => {
  const {
    callerId, callerName, callerProfileUrl,
    receiverId, receiverName, receiverProfileUrl
  } = req.body;

  const callId = new mongoose.Types.ObjectId().toString();

  const callerData = new Call({
    callerId,
    callerName,
    callerProfileUrl,
    callId,
    isCallDialed: true,
    isMissed: false,
    receiverId,
    receiverName,
    receiverProfileUrl
  });

  const receiverData = new Call({
    callerId: receiverId,
    callerName: receiverName,
    callerProfileUrl: receiverProfileUrl,
    callId,
    isCallDialed: false,
    isMissed: false,
    receiverId: callerId,
    receiverName: callerName,
    receiverProfileUrl: callerProfileUrl
  });

  try {
    await callerData.save();
    await receiverData.save();
    res.status(201).send({ message: "Call created successfully", callId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

// Save call history for caller and receiver
exports.saveCallHistory = async (req, res) => {
  const callData = req.body;
  try {
    await Call.updateOne(
      { callId: callData.callId, callerId: callData.callerId },
      { $set: callData },
      { upsert: true }
    );
    await Call.updateOne(
      { callId: callData.callId, callerId: callData.receiverId },
      { $set: callData },
      { upsert: true }
    );
    res.status(200).send({ message: "Call history saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

// Update call history status
exports.updateCallHistoryStatus = async (req, res) => {
  const { callId, callerId, isCallDialed, isMissed } = req.body;
  const updateData = {};
  if (isCallDialed !== undefined) updateData.isCallDialed = isCallDialed;
  if (isMissed !== undefined) updateData.isMissed = isMissed;

  try {
    await Call.updateOne({ callId, callerId }, { $set: updateData });
    res.status(200).send({ message: "Call history status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
