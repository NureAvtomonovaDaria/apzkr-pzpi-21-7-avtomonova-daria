import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Sub.css'

function EditSubscription() {
    const { subscriptionId } = useParams();
    const [coaches, setCoaches] = useState([]);
    const [subscription, setSubscription] = useState({
        name: '',
        price: '',
        duration: '',
        action: '',
        coach: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`http://localhost:3001/sub/${subscriptionId}`, { headers });
                setSubscription(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subscription:', error);
                setError('Error fetching subscription');
                setLoading(false);
            }
        };
        const fetchCoaches = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get('http://localhost:3001/coaches', { headers });
                setCoaches(response.data);
            } catch (error) {
                console.error('Error fetching coaches:', error);
            }
        };

        fetchCoaches();
        fetchSubscription();
    }, [subscriptionId]);

    const handleChange = (e) => {
        setSubscription({ ...subscription, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const updatedSubscription = {
            ...subscription,
            coach: subscription.coach === '' ? null : subscription.coach
        };

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.put(`http://localhost:3001/sub/${subscriptionId}`, updatedSubscription, { headers });
            setSuccess(true);
            console.log('Subscription updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating subscription:', error);
            setError('Error updating subscription');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='main-box'>
            <h2>Edit Subscription</h2>
            {success && <p>Subscription updated successfully!</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={subscription.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={subscription.price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Duration (days):</label>
                    <input
                        type="number"
                        name="duration"
                        value={subscription.duration}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Action:</label>
                    <input
                        type="number"
                        name="action"
                        value={subscription.action}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Coach:</label>
                    <select
                        name="coach"
                        value={subscription.coach}
                        onChange={handleChange}
                    >
                        <option value=''>Coach is not included</option>
                        {coaches.map((coach) => (
                            <option key={coach._id} value={coach._id}>
                                {coach.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default EditSubscription;
