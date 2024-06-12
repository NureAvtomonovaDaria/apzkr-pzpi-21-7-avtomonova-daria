const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Gym = require("../models/Gym");
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const Visit = require("../models/Visit");
const Subscription = require("../models/Subscription");

router.get('/export-purchase-history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Exporting purchase history for user ID: ${userId}`);

        const user = await User.findById(userId).populate({path: 'purchaseHistory', populate: {path: 'subscription'}});

        if (!user) {
            console.error(`User not found for ID: ${userId}`);
            return res.status(404).send('User not found');
        }

        if (user.purchaseHistory.length === 0) {
            console.error(`No purchase history found for user ID: ${userId}`);
            return res.status(404).send('No purchase history found');
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Purchase History');

        worksheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Product', key: 'product', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
        ];

        user.purchaseHistory.forEach(purchase => {
            worksheet.addRow({
                date: purchase.date,
                product: purchase.subscription.name,
                price: purchase.subscription.price,
            });
        });

        const dirPath = path.join(__dirname, 'temp');
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }

        const filePath = path.join(dirPath, `purchase_history_${userId}.xlsx`);
        await workbook.xlsx.writeFile(filePath);

        res.download(filePath, `purchase_history_${userId}.xlsx`, (err) => {
            if (err) {
                console.error('Failed to download the file:', err.message);
                res.status(500).json({ message: 'Failed to download the file', error: err.message });
            }
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error('Error exporting purchase history:', error.message);
        res.status(500).send(error.message);
    }
});

router.get('/subs-info/:userId/export', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Exporting subscriptions info for user ID: ${userId}`);

        const user = await User.findById(userId).populate({path:'subscription', populate: {path: 'coach'}});

        if (!user || !user.subscription || user.subscription.length === 0) {
            console.error(`No subscriptions found for user ID: ${userId}`);
            return res.status(404).send('No subscriptions found');
        }

        const subscriptions = user.subscription;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Subscriptions');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Duration', key: 'duration', width: 15 },
            { header: 'Coach', key: 'coach', width: 30 },
            { header: 'Action', key: 'action', width: 15 },
        ];

        subscriptions.forEach(subscription => {
            worksheet.addRow({
                name: subscription.name,
                price: subscription.price,
                duration: subscription.duration,
                coach: subscription.coach ? subscription.coach.name : 'Coach is not included',
                action: subscription.action
            });
        });


        const dirPath = path.join(__dirname, 'temp');
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }

        const filePath = path.join(dirPath, `subs_info_${userId}.xlsx`);
        await workbook.xlsx.writeFile(filePath);

        res.download(filePath, `subs_info_${userId}.xlsx`, (err) => {
            if (err) {
                console.error('Failed to download the file:', err.message);
                res.status(500).json({ message: 'Failed to download the file', error: err.message });
            }
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error('Error exporting subscriptions info:', error.message);
        res.status(500).send(error.message);
    }
});



module.exports = router;
