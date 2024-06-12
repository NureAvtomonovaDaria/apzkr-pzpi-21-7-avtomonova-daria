const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');
const { subscriptionValidationRules, validate } = require('../middleware/validators');
const admin = require('../middleware/admin');
const User = require("../models/User");
const Gym = require("../models/Gym");

router.get('/sub', async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate('coach');
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/sub/:id', async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id).populate('coach');
        if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/sub', admin, subscriptionValidationRules(), validate, async (req, res) => {
    const subscription = new Subscription(req.body);

    try {
        const newSubscription = await subscription.save();
        res.status(201).json(newSubscription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/sub/:gymId', admin, subscriptionValidationRules(), validate, async (req, res) => {
    const subscription = new Subscription(req.body);

    try {
        const newSubscription = await subscription.save();
        const updatedGym = await Gym.findByIdAndUpdate(
            req.params.gymId,
            {  $push: { subscriptions: newSubscription._id }  },
            { new: true }
        );

        if (!updatedGym) {
            return res.status(404).json({ message: 'Gym not found' });
        }
        res.status(201).json(newSubscription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/sub/:id', admin, subscriptionValidationRules(), validate, async (req, res) => {
    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSubscription) return res.status(404).json({ message: 'Subscription not found' });
        res.json(updatedSubscription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/sub/:id', async (req, res) => {
    try {
        const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!deletedSubscription) return res.status(404).json({ message: 'Subscription not found' });
        res.json({ message: 'Subscription deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
