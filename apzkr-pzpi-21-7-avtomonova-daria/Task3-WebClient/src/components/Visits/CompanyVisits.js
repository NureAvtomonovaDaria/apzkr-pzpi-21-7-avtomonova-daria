import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './CompanyVisits.css'

function CompanyVisits() {
    const { companyId } = useParams();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`http://localhost:3001/visits/company/${companyId}`, { headers });
                setVisits(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching visits:', error);
                setError('Error fetching visits');
                setLoading(false);
            }
        };

        fetchVisits();
    }, [companyId]);

    const exportToExcel = () => {
        const formattedVisits = visits.map(visit => ({
            Gym: visit.gym.address,
            'Date, Time': new Date(visit.date).toLocaleString(),
            User: visit.user ? visit.user.name : ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedVisits);
        const workbook = { Sheets: { 'Visits': worksheet }, SheetNames: ['Visits'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, 'visits.xlsx');
    };

    const saveAsExcelFile = (buffer, fileName) => {
        const data = new Blob([buffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Company Visits</h2>
            <button onClick={exportToExcel}>Export to Excel</button>
            <table>
                <thead>
                <tr>
                    <th>Gym</th>
                    <th>Date, Time</th>
                    <th>User</th>
                </tr>
                </thead>
                <tbody>
                {visits.map((visit) => (
                    <tr key={visit._id}>
                        <td>{visit.gym.address}</td>
                        <td>{new Date(visit.date).toLocaleString()}</td>
                        <td>{visit.user && visit.user.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CompanyVisits;
