// routes/callRoutes.js
const express = require('express');
const callController = require('../controllers/callController');
const router = express.Router();

router.post('/makeCall', callController.makeCall);
router.delete('/endCall/:callerId/:receiverId', callController.endCall);
router.get('/callHistory/:uid', callController.getMyCallHistory);
router.get('/userCalling/:uid', callController.getUserCalling);
router.post('/saveCallHistory', callController.saveCallHistory);
router.patch('/updateCallHistoryStatus', callController.updateCallHistoryStatus);

module.exports = router;
