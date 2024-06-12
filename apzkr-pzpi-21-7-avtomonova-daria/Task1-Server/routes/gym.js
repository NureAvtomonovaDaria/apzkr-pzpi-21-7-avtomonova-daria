const express = require('express');
const router = express.Router();
const Gym = require('../models/gym');
const { gymValidationRules, validate } = require('../middleware/validators');

router.get('/gyms', async (req, res) => {
    try {
        const gyms = await Gym.find().populate('company').populate('trainersList').populate('coachesList');
        res.json(gyms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/gym/:id', async (req, res) => {
    try {
        const gym = await Gym.findById(req.params.id).populate('company').populate('trainersList').populate('coachesList').populate({
            path: 'subscriptions',
            populate: { path: 'coach' }
        });
        if (!gym) return res.status(404).json({ message: 'Gym not found' });
        res.json(gym);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/gym', gymValidationRules(), validate, async (req, res) => {
    const gym = new Gym(req.body);

    try {
        const newGym = await gym.save();
        res.status(201).json(newGym);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/gym/:id', async (req, res) => {
    try {
        const updatedGym = await Gym.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGym) return res.status(404).json({ message: 'Gym not found' });
        res.json(updatedGym);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/gym/:id', async (req, res) => {
    try {
        const deletedGym = await Gym.findByIdAndDelete(req.params.id);
        if (!deletedGym) return res.status(404).json({ message: 'Gym not found' });
        res.json({ message: 'Gym deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
