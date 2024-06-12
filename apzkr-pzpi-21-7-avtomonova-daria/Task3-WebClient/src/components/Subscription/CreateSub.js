import React, { useState } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './Sub.css'

function CreateSubscription() {
    const { gymId } = useParams();
    const [subscription, setSubscription] = useState({
        name: '',
        price: '',
        duration: '',
    });
    const [loading, setLoading] = useState(false);

    const createSubscription = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.post(`http://localhost:3001/sub/${gymId}`, subscription, {headers});
            console.log('Subscription created successfully:', response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error creating subscription:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSubscription({ ...subscription, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createSubscription();
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='main-box'>
            <h2>Create Subscription</h2>
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
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateSubscription;
