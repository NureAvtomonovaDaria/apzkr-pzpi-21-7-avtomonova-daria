const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true,
    },
    qrCodeData: {
        type: String,
        required: true,
    }
});

const QrCode = mongoose.models.QrCode || mongoose.model('QrCode', qrCodeSchema);
module.exports = QrCode;