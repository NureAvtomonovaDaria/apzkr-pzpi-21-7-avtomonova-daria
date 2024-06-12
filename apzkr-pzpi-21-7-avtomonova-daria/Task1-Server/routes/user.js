const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Purchase = require('../models/Purchase');
const Visit = require('../models/Visit');
const bcrypt = require('bcryptjs');
const { userValidationRules, validate } = require('../middleware/validators');
const salt = require('../app');
const QrCode = require('../models/QrCode');
const QRCode = require('qrcode');
const Gym = require("../models/Gym");

router.get('/users', async (req, res) => {
    try {
        const users = await User.find().populate('purchaseHistory').populate('visits').populate('company').populate('subscription');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/coaches', async (req, res) => {
    try {
        const coaches = await User.find({ role: 'coach' });
        res.json(coaches);
    } catch (error) {
        console.error('Error fetching coaches:', error);
        res.status(500).json({ message: 'Error fetching coaches' });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('subscription')
            .populate({path: 'purchaseHistory', populate: {path:'subscription'}})
            .populate({path: 'visits', populate: {path:'gym'}})
            .populate('company')
            .populate({
                path: 'subscription',
                populate: { path: 'coach' }
            });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/user', userValidationRules(), validate, async (req, res) => {
    const user = new User(req.body);

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/user/:userId/addCard', async (req, res) => {
    const { userId } = req.params;
    const { cardNumber } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        user.card = cardNumber;
        await user.save();
        res.send('Card added successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.put('/user/:id', userValidationRules(), validate, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/user/:id/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/user/sub', async (req, res) => {
    try {
        const { subscriptionId, userId } = req.body;

        await User.findByIdAndUpdate(userId, { $push: { subscription: subscriptionId } });

        const qrData = {
            userId: userId,
            subscriptionId: subscriptionId,
        };

        const qrCodeData = await QRCode.toDataURL(JSON.stringify(qrData));

        const newQrCode = new QrCode({
            userId: userId,
            subscriptionId: subscriptionId,
            qrCodeData: qrCodeData,
        });

        await newQrCode.save();

        const newPurchase = new Purchase({
            subscription: subscriptionId,
            date: new Date(),
        });

        await User.findByIdAndUpdate(userId, { $push: { purchaseHistory: newPurchase._id } });

        await newPurchase.save();


        res.status(200).send('Subscription purchased successfully');


    } catch (error) {
        console.error('Error purchasing subscription:', error);
        res.status(500).json({ message: 'Error purchasing subscription' });
    }
});

router.get('/qrs', async (req, res) => {
    try {
        const qrCodes = await QrCode.find();
        res.status(200).json(qrCodes);
    } catch (error) {
        console.error('Error fetching QR codes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
