const express = require('express');
const router = express.Router();
const Visit= require('../models/visit');
const Gym = require('../models/Gym');

router.get('/visit/:id', async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id).populate('gym').populate('user');
        if (!visit) return res.status(404).json({ message: 'Visit not found' });
        res.json(visit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/visits/company/:companyId', async (req, res) => {
    try {
        const companyId = req.params.companyId;

        const gyms = await Gym.find({ company: companyId }).select('_id');

        const gymIds = gyms.map(gym => gym._id);

        const visits = await Visit.find({ gym: { $in: gymIds } })
            .populate('gym')
            .populate('user');

        res.json(visits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/visit', async (req, res) => {
    const purchase = new Visit(req.body);

    try {
        const newVisit = await visit.save();
        res.status(201).json(newVisit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/visit/:id', async (req, res) => {
    try {
        const updatedVisit = await Visit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVisit) return res.status(404).json({ message: 'Visit not found' });
        res.json(updatedVisit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/visit/:id', async (req, res) => {
    try {
        const deletedVisit = await Visit.findByIdAndDelete(req.params.id);
        if (!deletedVisit) return res.status(404).json({ message: 'Visit not found' });
        res.json({ message: 'Visit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;