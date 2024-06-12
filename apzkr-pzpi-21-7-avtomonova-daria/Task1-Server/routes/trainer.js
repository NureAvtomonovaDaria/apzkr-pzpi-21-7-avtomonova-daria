const express = require('express');
const router = express.Router();
const Trainer = require('../models/trainer');

router.get('/trainers', async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.json(trainers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/trainer/:id', async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
        res.json(trainer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/trainer', async (req, res) => {
    const trainer = new Trainer(req.body);

    try {
        const newTrainer = await trainer.save();
        res.status(201).json(newTrainer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/trainer/:id', async (req, res) => {
    try {
        const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTrainer) return res.status(404).json({ message: 'Trainer not found' });
        res.json(updatedTrainer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/trainer/:id', async (req, res) => {
    try {
        const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
        if (!deletedTrainer) return res.status(404).json({ message: 'Trainer not found' });
        res.json({ message: 'Trainer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;