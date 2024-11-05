const express = require('express');
const Status = require('./statusModel'); 

const router = express.Router();

// Create Status
router.post('/statuses', async (req, res) => {
    try {
        const status = new Status(req.body);
        await status.save();
        res.status(201).send(status);
    } catch (error) {
        res.status(400).send({ error: 'Error creating status' });
    }
});

// Get My Status
router.get('/statuses/my/:uid', async (req, res) => {
    try {
        const statuses = await Status.find({
            uid: req.params.uid,
            createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        });
        res.send(statuses);
    } catch (error) {
        res.status(400).send({ error: 'Error fetching statuses' });
    }
});

// Delete Status
router.delete('/statuses/:id', async (req, res) => {
    try {
        await Status.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send({ error: 'Error deleting status' });
    }
});

// Update Status
router.put('/statuses/:id', async (req, res) => {
    try {
        const status = await Status.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(status);
    } catch (error) {
        res.status(400).send({ error: 'Error updating status' });
    }
});

// Update Seen Status
router.patch('/statuses/:id/seen', async (req, res) => {
    try {
        const { imageIndex, userId } = req.body;
        const status = await Status.findById(req.params.id);

        if (status) {
            const viewers = status.stories[imageIndex].viewers || [];
            if (!viewers.includes(userId)) {
                viewers.push(userId);
                status.stories[imageIndex].viewers = viewers;
                await status.save();
                res.send(status);
            } else {
                res.status(200).send(status);
            }
        } else {
            res.status(404).send({ error: 'Status not found' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Error updating viewers list' });
    }
});

module.exports = router;
