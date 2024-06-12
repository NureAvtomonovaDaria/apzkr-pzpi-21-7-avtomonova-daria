import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CompanyList.css';

function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('http://localhost:3001/companies');
                setCompanies(response.data);
                setFilteredCompanies(response.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    useEffect(() => {
        const results = companies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCompanies(results);
    }, [searchTerm, companies]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="company-list-container">
            <h2>Companies</h2>
            <input
                type="text"
                placeholder="Search for a company"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <ul className="company-list">
                {filteredCompanies.map(company => (
                    <li key={company._id} className="company-item">
                        <Link to={`/companies/${company._id}`} className='company-item-link'>
                            {company.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CompanyList;