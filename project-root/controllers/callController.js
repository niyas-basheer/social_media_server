// controllers/callController.js
const Call = require('../models/call');

exports.makeCall = async (req, res) => {
    try {
        const { callerId, callerName, callerProfileUrl, receiverId, receiverName, receiverProfileUrl } = req.body;

        const callId = new mongoose.Types.ObjectId();  // Unique call ID
        const callerData = new Call({
            callerId,
            callerName,
            callerProfileUrl,
            callId,
            isCallDialed: true,
            isMissed: false,
            receiverId,
            receiverName,
            receiverProfileUrl,
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
            receiverProfileUrl: callerProfileUrl,
        });

        await callerData.save();
        await receiverData.save();

        res.status(200).json({ message: 'Call initiated successfully', callId });
    } catch (error) {
        console.error('Error in makeCall:', error);
        res.status(500).json({ error: 'Error initiating call' });
    }
};

// Define other controllers such as `endCall`, `saveCallHistory`, `getMyCallHistory`, etc.
