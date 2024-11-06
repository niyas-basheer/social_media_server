const StatusModel = require('../models/StatusModel');

// Create a new status
exports.createStatus = async (req, res) => {
    try {
        const { content } = req.body;
        const newStatus = new StatusModel({ content });
        await newStatus.save();
        res.status(201).json({ message: 'Status created successfully', newStatus });
    } catch (error) {
        res.status(500).json({ message: 'Error creating status', error });
    }
};

// Get all statuses
exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await StatusModel.find();
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statuses', error });
    }
};

// Get a specific status by ID
exports.getStatusById = async (req, res) => {
    try {
        const status = await StatusModel.findById(req.params.id);
        if (!status) {
            return res.status(404).json({ message: 'Status not found' });
        }
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching status', error });
    }
};

// Update a status
exports.updateStatus = async (req, res) => {
    try {
        const status = await StatusModel.findByIdAndUpdate(
            req.params.id,
            { content: req.body.content },
            { new: true }
        );
        if (!status) {
            return res.status(404).json({ message: 'Status not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', status });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
};

// Delete a status
exports.deleteStatus = async (req, res) => {
    try {
        const status = await StatusModel.findByIdAndDelete(req.params.id);
        if (!status) {
            return res.status(404).json({ message: 'Status not found' });
        }
        res.status(200).json({ message: 'Status deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting status', error });
    }
};
