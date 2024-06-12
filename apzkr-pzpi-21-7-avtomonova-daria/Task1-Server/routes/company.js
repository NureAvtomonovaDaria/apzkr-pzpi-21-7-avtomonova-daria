const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Gym = require('../models/Gym');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

router.get('/companies', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/company/:id/gyms', async (req, res) => {
    try {
        const gyms = await Gym.find({ company: req.params.id });
        res.json(gyms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/company/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/company/:id/gym', auth, admin, async (req, res) => {
    try {
        const gym = new Gym({ ...req.body, company: req.params.id });
        await gym.save();
        res.status(201).json(gym);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/company/:userId', [auth, admin, body('name').notEmpty().withMessage('Name is required')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const company = new Company(req.body);

    try {
        const newCompany = await company.save();

        if (!req.params.userId) {
            return res.status(400).json({ message: 'User ID is not provided' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { company: newCompany._id },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json(newCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/company/:id',[auth, admin, body('name').notEmpty().withMessage('Name is required')], async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCompany) return res.status(404).json({ message: 'Company not found' });
        res.json(updatedCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/company/:id', auth, admin, async (req, res) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id);
        if (!deletedCompany) return res.status(404).json({ message: 'Company not found' });
        res.json({ message: 'Company deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;