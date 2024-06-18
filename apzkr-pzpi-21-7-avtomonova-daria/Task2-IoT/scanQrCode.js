function scanQRCode(User, Gym, Visit) {
    return async (req, res) => {
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
    };
}



