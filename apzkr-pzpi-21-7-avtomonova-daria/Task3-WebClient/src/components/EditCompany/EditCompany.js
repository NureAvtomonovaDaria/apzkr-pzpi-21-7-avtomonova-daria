import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './EditCompany.css';

function EditCompany() {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [newGym, setNewGym] = useState({ address: '', zones: [], trainersList: [], coachesList: [], subscriptions: [] });
    const [loading, setLoading] = useState(true);
    const [trainers, setTrainers] = useState([]);
    const [subs, setSubs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
    const [selectedGymIndex, setSelectedGymIndex] = useState(null);
    const [coaches, setCoaches] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const [companyResponse, gymsResponse, trainersResponse, coachesResponse, subsResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/company/${companyId}`),
                    axios.get(`http://localhost:3001/company/${companyId}/gyms`),
                    axios.get('http://localhost:3001/trainers', { headers }),
                    axios.get('http://localhost:3001/coaches', { headers }),
                    axios.get('http://localhost:3001/sub', { headers })
                ]);
                setCompany(companyResponse.data);
                setGyms(gymsResponse.data);
                setTrainers(trainersResponse.data);
                setCoaches(coachesResponse.data);
                setSubs(subsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId]);

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTrainers = trainers.filter(trainer =>
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCoaches = coaches.filter(coach =>
        coach.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddCoachToGym = (coachId) => {
        if (selectedGymIndex !== null) {
            const updatedGyms = [...gyms];
            updatedGyms[selectedGymIndex].coachesList.push(coachId);
            setGyms(updatedGyms);
            closeCoachModal();
        }
    };

    const handleRemoveCoachFromGym = (gymIndex, coachId) => {
        const updatedGyms = [...gyms];
        updatedGyms[gymIndex].coachesList = updatedGyms[gymIndex].coachesList.filter(id => id !== coachId);
        setGyms(updatedGyms);
    };

    const handleCompanyChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleGymChange = (index, e) => {
        const updatedGyms = [...gyms];
        updatedGyms[index] = { ...updatedGyms[index], [e.target.name]: e.target.value };
        setGyms(updatedGyms);
    };

    const handleNewGymChange = (e) => {
        setNewGym({ ...newGym, [e.target.name]: e.target.value });
    };

    const handleZoneChange = (index, e) => {
        const updatedGyms = [...gyms];
        if (e.target.checked) {
            updatedGyms[index].zones.push(e.target.value);
        } else {
            updatedGyms[index].zones = updatedGyms[index].zones.filter(zone => zone !== e.target.value);
        }
        setGyms(updatedGyms);
    };

    const handleNewGymZoneChange = (e) => {
        const updatedZones = [...newGym.zones];
        if (e.target.checked) {
            updatedZones.push(e.target.value);
        } else {
            const index = updatedZones.indexOf(e.target.value);
            if (index > -1) {
                updatedZones.splice(index, 1);
            }
        }
        setNewGym({ ...newGym, zones: updatedZones });
    };

    const handleUpdateCompany = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`http://localhost:3001/company/${companyId}`, company, { headers });
            alert('Company updated successfully');
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };

    const handleUpdateGym = async (index) => {
        try {
            const gymId = gyms[index]._id;
            await axios.put(`http://localhost:3001/gym/${gymId}`, gyms[index]);
            alert('Gym updated successfully');
        } catch (error) {
            console.error('Error updating gym:', error);
        }
    };

    const handleAddGym = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.post(`http://localhost:3001/company/${companyId}/gym`, newGym, { headers });
            alert('Gym added successfully');
            setNewGym({ address: '', zones: [], trainersList: [], coachesList: [], subscriptions: [] });
            setGyms([...gyms, response.data]);
        } catch (error) {
            console.error('Error adding gym:', error);
        }
    };

    const handleDeleteGym = async (index) => {
        try {
            const gymId = gyms[index]._id;
            await axios.delete(`http://localhost:3001/gym/${gymId}`);
            setGyms(gyms.filter((gym, i) => i !== index));
            alert('Gym deleted successfully');
        } catch (error) {
            console.error('Error deleting gym:', error);
        }
    };

    const openTrainerModal = (index) => {
        setSelectedGymIndex(index);
        setIsModalOpen(true);
    };

    const closeTrainerModal = () => {
        setIsModalOpen(false);
        setSelectedGymIndex(null);
    };

    const openCoachModal = (index) => {
        setSelectedGymIndex(index);
        setIsCoachModalOpen(true);
    };

    const closeCoachModal = () => {
        setIsCoachModalOpen(false);
        setSelectedGymIndex(null);
    };

    const handleAddTrainerToGym = (trainerId) => {
        if (selectedGymIndex !== null) {
            const updatedGyms = [...gyms];
            updatedGyms[selectedGymIndex].trainersList.push(trainerId);
            setGyms(updatedGyms);
            closeTrainerModal();
        }
    };

    const handleRemoveTrainerFromGym = (gymIndex, trainerId) => {
        const updatedGyms = [...gyms];
        updatedGyms[gymIndex].trainersList = updatedGyms[gymIndex].trainersList.filter(id => id !== trainerId);
        setGyms(updatedGyms);
    };

    if (loading) return <p>Loading...</p>;
    if (!company) return <p>Company not found</p>;

    const zoneOptions = ['Gym', 'Pool', 'Boxing', 'Yoga'];

    return (
        <div className="edit-company-container">
            <h2>Edit Company</h2>
            <div className="edit-company-details">
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={company.name}
                    onChange={handleCompanyChange}
                />
                <button onClick={handleUpdateCompany}>Update Company</button>
                <Link to={`/visits/company/${companyId}`}>Show company visits</Link>
            </div>
            <h3>Gyms</h3>
            {gyms.map((gym, gymIndex) => (
                <div key={gym._id} className="edit-gym">
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={gym.address}
                        onChange={(e) => handleGymChange(gymIndex, e)}
                    />
                    <div>
                        <label>Zones:</label>
                        <div className='zones-box'>
                            {zoneOptions.map(zone => (
                                <label key={zone}>
                                    <input
                                        type="checkbox"
                                        value={zone}
                                        checked={gym.zones.includes(zone)}
                                        onChange={(e) => handleZoneChange(gymIndex, e)}
                                    />
                                    {zone}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label>Trainers:</label>
                        <ul>
                            {gym.trainersList.map(trainerId => (
                                <li key={trainerId}>
                                    {trainers.find(trainer => trainer._id === trainerId)?.name}
                                    <button className='edit-delete-button'
                                            onClick={() => handleRemoveTrainerFromGym(gymIndex, trainerId)}>x
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => openTrainerModal(gymIndex)}>Add Trainer</button>
                    <div>
                        <label>Coaches:</label>
                        <ul>
                            {gym.coachesList.map((coachId, index) => (
                                <li key={index}>
                                    {coaches.find(coach => coach._id === coachId)?.name}
                                    <button className='edit-delete-button'
                                            onClick={() => handleRemoveCoachFromGym(gymIndex, coachId)}>x
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => openCoachModal(gymIndex)}>Add Coach</button>
                    <div>
                        <label>Subscriptions:</label>
                        <ul>
                            {gym.subscriptions.map(subId => (
                                <li key={subId}>
                                    {subs.find(sub => sub._id === subId)?.name}
                                    <Link to={`/subscriptions/edit/${subId}`}>Edit</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link to={`/subscription/${gym._id}/create`}>Add Subscription</Link>
                    <button onClick={() => handleUpdateGym(gymIndex)}>Update Gym</button>
                    <button onClick={() => handleDeleteGym(gymIndex)}>Delete Gym</button>
                </div>
            ))}
            <h3>Add New Gym</h3>
            <div className="add-gym">
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={newGym.address}
                    onChange={handleNewGymChange}
                />
                <div>
                    <label>Zones:</label>
                    <div className='zones-box'>
                        {zoneOptions.map(zone => (
                            <label key={zone}>
                                <input
                                    type="checkbox"
                                    value={zone}
                                    checked={newGym.zones.includes(zone)}
                                    onChange={handleNewGymZoneChange}
                                />
                                {zone}
                            </label>
                        ))}
                    </div>
                </div>
                <button onClick={handleAddGym}>Add Gym</button>
            </div>
            {isModalOpen && (
                <Modal
                    title="Select a Trainer"
                    closeModal={closeTrainerModal}
                    searchQuery={searchQuery}
                    handleSearchInputChange={handleSearchInputChange}
                    filteredItems={filteredTrainers}
                    handleAddItemToGym={handleAddTrainerToGym}
                />
            )}
            {isCoachModalOpen && (
                <Modal
                    title="Select a Coach"
                    closeModal={closeCoachModal}
                    searchQuery={searchQuery}
                    handleSearchInputChange={handleSearchInputChange}
                    filteredItems={filteredCoaches}
                    handleAddItemToGym={handleAddCoachToGym}
                />
            )}
        </div>
    );
}

function Modal({ title, closeModal, searchQuery, handleSearchInputChange, filteredItems, handleAddItemToGym }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h3>{title}</h3>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <ul>
                    {filteredItems.map(item => (
                        <li key={item._id} onClick={() => handleAddItemToGym(item._id)}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default EditCompany;
