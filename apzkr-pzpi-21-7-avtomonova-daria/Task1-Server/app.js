const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const userRouter = require('./routes/user');
const subRouter = require('./routes/subscription');
const gymRouter = require('./routes/gym');
const companyRouter = require('./routes/company');
const trainerRouter = require('./routes/trainer');
const purchaseRouter = require('./routes/purchase');
const visitRouter = require('./routes/visit');
const exportRouter = require('./routes/export');

const authRouter = require('./routes/auth');
const auth = require('./middleware/auth');

const Gym = require("./models/Gym");
const Visit = require("./models/Visit");
const User = require("./models/User");
const Subscription = require("./models/Subscription");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());

app.post('/scanQRCode', async (req, res) => {
    try {
        const { subscriptionId, userId } = req.body;

        const gym = await Gym.findOne({ subscriptions: { $in: [subscriptionId] } });

        if (!gym) {
            return res.status(404).send({ error: 'Gym not found for this subscription' });
        }

        const newVisit = new Visit({
            gym: gym._id,
            duration: 60,
            date: new Date(),
            user: userId,
        });

        await User.findByIdAndUpdate(userId, { $push: { visits: newVisit._id } });

        await newVisit.save();
        console.log('QR Code scanned:', req.body);
        res.status(200).send({ message: 'QR Code scanned successfully' });
    } catch (error) {
        console.error('Error scanning QR Code:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});


app.use('/', gymRouter);
app.use('/', companyRouter);

app.use('/', authRouter);

app.use('/', auth, exportRouter);
app.use('/', auth, userRouter);
app.use('/', auth, subRouter);
app.use('/', trainerRouter);
app.use('/', auth, purchaseRouter);
app.use('/', auth, visitRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

