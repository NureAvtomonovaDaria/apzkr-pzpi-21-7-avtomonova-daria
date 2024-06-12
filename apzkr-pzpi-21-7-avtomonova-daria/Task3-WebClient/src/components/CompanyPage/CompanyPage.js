import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './CompanyPage.css';

function CompanyPage() {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchAddress, setSearchAddress] = useState('');
    const [selectedZone, setSelectedZone] = useState('');
    const [filteredGyms, setFilteredGyms] = useState([]);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/company/${companyId}`);
                setCompany(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching company:', error);
                setLoading(false);
            }
        };

        const fetchGyms = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/company/${companyId}/gyms`);
                setGyms(response.data);
                setFilteredGyms(response.data);
            } catch (error) {
                console.error('Error fetching gyms:', error);
            }
        };

        fetchCompany();
        fetchGyms();
    }, [companyId]);

    useEffect(() => {
        const filterGyms = () => {
            let filtered = gyms;
            if (searchAddress) {
                filtered = filtered.filter(gym =>
                    gym.address.toLowerCase().includes(searchAddress.toLowerCase())
                );
            }
            if (selectedZone) {
                filtered = filtered.filter(gym =>
                    gym.zones.includes(selectedZone)
                );
            }
            setFilteredGyms(filtered);
        };

        filterGyms();
    }, [searchAddress, selectedZone, gyms]);

    if (loading) return <p>Loading...</p>;
    if (!company) return <p>Company not found</p>;

    return (
        <div className="company-page-container">
            <h2>{company.name}</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by address"
                    value={searchAddress}
                    onChange={e => setSearchAddress(e.target.value)}
                />
                <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
                    <option value="">All Zones</option>
                    <option value="Pool">Pool</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Gym">Gym</option>
                    <option value="Boxing">Boxing</option>
                </select>
            </div>
            <h3>Gyms:</h3>
            <ul className="gym-list">
                {filteredGyms.map(gym => (
                    <Link key={gym._id} to={`/gym/${gym._id}`} className="gym-link">
                        <li className="gym-item">
                            <p><strong>Address:</strong> {gym.address}</p>
                            <p><strong>Zones:</strong> {gym.zones.join(', ')}</p>
                            <p><strong>Trainers:</strong> {gym.trainersList.length}</p>
                            <p><strong>Coaches:</strong> {gym.coachesList.length}</p>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default CompanyPage;
