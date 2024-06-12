import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './GymPage.css';

function GymPage() {
    const { gymId } = useParams();
    const [gym, setGym] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [cardDetails, setCardDetails] = useState({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });

    useEffect(() => {
        const fetchGym = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/gym/${gymId}`);
                setGym(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gym:', error);
                setLoading(false);
            }
        };

        fetchGym();
    }, [gymId]);

    const handleBuyClick = (subscription) => {
        setSelectedSubscription(subscription);
        setIsModalOpen(true);
    };

    const handleConfirmPurchase = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const userResponse = await axios.get(`http://localhost:3001/user/${userId}`, { headers });
                const user = userResponse.data;

                if (user.card) {
                    const response = await axios.post(`http://localhost:3001/user/sub`, {
                        subscriptionId: selectedSubscription._id,
                        userId: userId,
                    }, { headers });
                    alert('Subscription purchased:', response.data);
                    setIsModalOpen(false);
                } else {
                    setIsModalOpen(false);
                    setIsCardModalOpen(true);
                }
            } catch (error) {
                console.error('Error purchasing subscription:', error);
            }
        } else {
            alert('You need to be logged in to make a purchase.');
        }
    };

    const handleAddCard = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            try {
                const headers = { Authorization: `Bearer ${token}` };
                await axios.post(`http://localhost:3001/user/${userId}/addCard`, cardDetails, { headers });
                setIsCardModalOpen(false);
                alert('Card added successfully.');
                handleConfirmPurchase();
            } catch (error) {
                console.error('Error adding card:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseCardModal = () => {
        setIsCardModalOpen(false);
    };

    const handleCardDetailsChange = (e) => {
        const { name, value } = e.target;
        setCardDetails({ ...cardDetails, [name]: value });
    };

    if (loading) return <p>Loading...</p>;
    if (!gym) return <p>Gym not found</p>;

    return (
        <div className='wrapper'>
            <div className="gym-container">
                <h2 className="gym-name">{gym.address}</h2>
                <p className="gym-address">Company: {gym.company.name}</p>
                <h3>Zones</h3>
                <ul>
                    {gym.zones.map((zone, index) => (
                        <li key={index}>{zone}</li>
                    ))}
                </ul>
            </div>
            <h3>Trainers List</h3>
            <div className="trainers-container">
                <ul>
                    {gym.trainersList.map((trainer, index) => (
                        <li key={index}>{trainer.name}</li>
                    ))}
                </ul>
            </div>
            <h3>Coaches List</h3>
            <div className="coaches-container">
                <ul>
                    {gym.coachesList.map((coach, index) => (
                        <li key={index}>{coach.name}</li>
                    ))}
                </ul>
            </div>
            <h3>Subscriptions</h3>
            <div className="subs-container">
                <ul>
                    {gym.subscriptions.map((subscription, index) => (
                        <li key={index}>
                            <h4>{subscription.name}</h4>
                            <p>Price: {subscription.price}$</p>
                            <p>Coach: {subscription.coach ? subscription.coach.name : 'Coach is not included'}</p>
                            <p>Duration: {subscription.duration} days</p>
                            <p>Action: {subscription.action}%</p>
                            <button onClick={() => handleBuyClick(subscription)}>Buy</button>
                        </li>
                    ))}
                </ul>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirm Purchase</h2>
                        <p>Are you sure you want to buy the subscription "{selectedSubscription.name}" for {selectedSubscription.price}$?</p>
                        <button onClick={handleConfirmPurchase}>Confirm</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}

            {isCardModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Card</h2>
                        <form className='modal-form-card'>
                            <label>
                                Card Number:
                                <input type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardDetailsChange} />
                            </label>
                        </form>
                        <button onClick={handleAddCard}>Add Card</button>
                        <button onClick={handleCloseCardModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GymPage;