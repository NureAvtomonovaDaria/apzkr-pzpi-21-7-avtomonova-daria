import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Profile.css';
import QRCode from 'qrcode.react';

function isAdmin(user, qrs) {
    const handleScanQRCode = async (subId, userId, qrCode) => {
        try {
            const response = await axios.post('http://localhost:1880/scanQRCode', {
                qrCode: qrCode,
            });
            console.log('QR Code scanned:', response.data);
        } catch (error) {
            console.error('Error scanning QR Code:', error);
        }
    };

    if (user.role === 'admin') {
        return (
            <>
                <div className="visits-container">
                    <label>Company</label>
                    <p>{user.company ? user.company.name : '-'}</p>
                </div>
            </>
        );
    } else if (user.role === 'user') {
        return (
            <div className='profile-info'>
                <div className="visits-container">
                    <label>Visits</label>
                    {user.visits &&
                        user.visits.map((visit, index) => (
                            <p key={index}>
                                {visit.gym.address}, {new Date(visit.date).toLocaleString()}
                            </p>
                        ))}
                </div>
                <div className="purchase-history-container">
                    <label>Purchase History</label>
                    {user.purchaseHistory &&
                        user.purchaseHistory.map((purchase, index) => (
                            <p key={index}>
                                {purchase.subscription.name}, {purchase.subscription.price}$, {new Date(purchase.date).toLocaleString()}
                            </p>
                        ))}
                </div>
                <div className="card-container">
                    <label>Card</label>
                    <p>{user.card || '-'}</p>
                </div>
                <div className="sub-container">
                    <label>Subscriptions</label>
                    <ul>
                        {user.subscription &&
                            user.subscription.map((subscription, index) => (
                                <li key={index}>
                                    <h4>{subscription.name}</h4>
                                    <p>Price: {subscription.price}$</p>
                                    <p>Coach: {subscription.coach ? subscription.coach.name : 'Coach is not included'}</p>
                                    <p>Duration: {subscription.duration} days</p>
                                    <p>Action: {subscription.action}%</p>
                                    <p>QRCode:</p>
                                    <div>{getQRcode(qrs, subscription._id, user._id) ? <QRCode value={getQRcode(qrs, subscription._id, user._id).qrCodeData} /> : '-'}</div>
                                    <button onClick={() => handleScanQRCode(subscription._id, user._id, getQRcode(qrs, subscription._id, user._id).qrCodeData)}>Scan QRCode</button>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        );
    }
}

function getQRcode(qrCodes, subId, userId) {
    if (!Array.isArray(qrCodes)) {
        throw new Error('First argument must be an array');
    }
    if (!subId || !userId) {
        throw new Error('Both subId and userId are required');
    }

    const qrCode = qrCodes.find(
        (qrCode) => qrCode.subscriptionId.toString() === subId.toString() && qrCode.userId.toString() === userId.toString()
    );

    return qrCode || null;
}

function Profile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrs, setQrs] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`http://localhost:3001/user/${userId}`, { headers });
                const qrResponse = await axios.get(`http://localhost:3001/qrs`, { headers });
                setUser(response.data);
                setQrs(qrResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const exportPurchaseHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:3001/export-purchase-history/${userId}`, {
                headers,
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `purchase_history_${userId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting purchase history:', error);
        }
    };

    const exportSubscriptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:3001/subs-info/${userId}/export`, {
                headers,
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `subs_info_${userId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting subscriptions info:', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(`http://localhost:3001/user/${userId}`, { headers });
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const toggleConfirmation = () => {
        setShowConfirmation(!showConfirmation);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-email">{user.email}</p>
            </div>
            <div className="profile-details">
                <div className="profile-detail">
                    <label>Phone</label>
                    <p>{user.phone || '-'}</p>
                </div>
                <div className="profile-detail">
                    <label>Role</label>
                    <p>{user.role}</p>
                </div>
            </div>
            {isAdmin(user, qrs)}
            <div className="profile-actions">
                {user.role === 'user' && (
                    <>
                        <button className="export-button" onClick={exportPurchaseHistory}>
                            Export Purchase History
                        </button>
                        <button className="export-button" onClick={exportSubscriptions}>
                            Export Subscriptions Info
                        </button>
                    </>
                )}
                <button className="profile-action-button" onClick={() => navigate(`/user/${userId}/edit`)}>
                    Edit Profile
                </button>
                <button className="delete-button" onClick={toggleConfirmation}>
                    Delete Account
                </button>
                <button className="delete-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            {showConfirmation && (
                <div className="confirmation-modal">
                    <p>Are you sure you want to delete your account?</p>
                    <div className="confirmation-buttons">
                        <button onClick={handleDeleteAccount}>Yes</button>
                        <button onClick={toggleConfirmation}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
