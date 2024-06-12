const express = require('express');
const router = express.Router();
const Purchase= require('../models/purchase');

router.get('/purchase/:id', async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id).populate('subscription');
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/purchase', async (req, res) => {
    const purchase = new Purchase(req.body);

    try {
        const newPurchase = await purchase.save();
        res.status(201).json(newPurchase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/purchase/:id', async (req, res) => {
    try {
        const updatedPurchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPurchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json(updatedPurchase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/purchase/:id', async (req, res) => {
    try {
        const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
        if (!deletedPurchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json({ message: 'Purchase deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;