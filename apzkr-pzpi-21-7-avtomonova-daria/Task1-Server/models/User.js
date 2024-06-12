const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'coach'], default: 'user' },
    subscription: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
    phone: String,
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }],
    visits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visit' }],
    card: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.models.User ||mongoose.model('User', userSchema);
module.exports = User;
