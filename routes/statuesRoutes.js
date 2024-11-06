const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// Route to create a new status
router.post('/status', statusController.createStatus);

// Route to get all statuses
router.get('/statuses', statusController.getAllStatuses);

// Route to get a status by ID
router.get('/status/:id', statusController.getStatusById);

// Route to update a status by ID
router.put('/status/:id', statusController.updateStatus);

// Route to delete a status by ID
router.delete('/status/:id', statusController.deleteStatus);

module.exports = router;
