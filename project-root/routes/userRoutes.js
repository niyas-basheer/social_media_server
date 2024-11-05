const express = require('express');
const User = require('./userModel'); 
const router = express.Router();

// Create User
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: 'Error creating user' });
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(400).send({ error: 'Error fetching users' });
    }
});

// Get Single User by UID
router.get('/users/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: 'Error fetching user' });
    }
});

// Update User
router.put('/users/:uid', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ uid: req.params.uid }, req.body, { new: true });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: 'Error updating user' });
    }
});

// Delete User
router.delete('/users/:uid', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ uid: req.params.uid });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).send({ error: 'Error deleting user' });
    }
});

// Verify Phone Number (for demonstration purposes)
router.post('/users/:uid/verifyPhone', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        // Logic to send verification SMS would go here
        // This is just a placeholder
        res.send({ message: `Verification SMS sent to ${phoneNumber}` });
    } catch (error) {
        res.status(400).send({ error: 'Error verifying phone number' });
    }
});

module.exports = router;
