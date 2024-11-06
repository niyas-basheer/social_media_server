const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');

// Define routes
router.post('/endCall', callController.endCall);
router.get('/getCallChannelId/:uid', callController.getCallChannelId);
router.get('/getMyCallHistory/:uid', callController.getMyCallHistory);
router.get('/getUserCalling/:uid', callController.getUserCalling);
router.post('/makeCall', callController.makeCall);
router.post('/saveCallHistory', callController.saveCallHistory);
router.put('/updateCallHistoryStatus', callController.updateCallHistoryStatus);

module.exports = router;

