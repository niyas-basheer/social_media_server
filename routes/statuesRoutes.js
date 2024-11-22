const express = require("express");
const router = express.Router();
const {
  createStatus,
  deleteStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
} = require("../controllers/statusController");

// Route to create a new status
router.post("/status", createStatus);

// Route to get all statuses
router.get("/statuses", getAllStatuses);

// Route to get a status by ID
router.get("/status/:id", getStatusById);

// Route to update a status by ID
router.put("/status/:id", updateStatus);

// Route to delete a status by ID
router.delete("/status/:id", deleteStatus);

module.exports = router;
