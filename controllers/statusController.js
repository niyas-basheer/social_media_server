const StatusModel = require("../models/StatusModel");

// Create a new status
const createStatus = async (req, res) => {
  console.log(req.body, "🚀create satues");
  try {
    const content  = req.body;
    const newStatus = new StatusModel(content);
    await newStatus.save();
    res.status(201).json({ message: "Status created successfully", newStatus });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating status", error });
  }
};

// Get all statuses
const getAllStatuses = async (req, res) => {
  try {
    
    const statuses = await StatusModel.find();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching statuses", error });
  }
};

// Get a specific status by ID
const getStatusById = async (req, res) => {
  try {
    console.log(req.params);
    
    const status = await StatusModel.findOne({useruid:req.params.id});
    console.log(status)
    if (!status) {
      return res
        .status(404)
        .json({ message: "Status not found", data: [], success: false });
    }
    res
      .status(200)
      .json({ data: status, success: true, message: "status retrived " });
  } catch (error) {
    res.status(500).json({ message: "Error fetching status", error });
  }
};

// Update a status
const updateStatus = async (req, res) => {
  try {
    const status = await StatusModel.findByIdAndUpdate(
      { statusId: req.params.statusId},
      req.body,
      { new: true }
    );
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.send(status);
    res.status(200).json({ message: "Status updated successfully", status });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Delete a status
const deleteStatus = async (req, res) => {
  try {
    const status = await StatusModel.findByIdAndDelete(req.params.id);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.status(200).json({ message: "Status deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting status", error });
  }
};
const updateViewers = async (req,res) => {
  try {
   
    console.log(req.body,"🚀update satues");
    const {statusId,storyIndex,userId}=req.body
    const status = await StatusModel.findOneAndUpdate(
      { _id: statusId, [`stories.${storyIndex}`]: { $exists: true } },
      {
        $addToSet: { [`stories.${storyIndex}.viewers`]: userId }, 
      },
      { new: true }
    );

    if (!status) {
      throw new Error("Status or story not found");
    }

    return status;
  } catch (error) {
    console.error("Error updating viewers:", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  updateViewers,
  createStatus,
  deleteStatus,
  updateStatus,
  getStatusById,
  getAllStatuses,
};
