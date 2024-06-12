import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Register from './components/Register/Register';
import EditProfile from './components/EditProfile/EditProfile';
import CompanyList from './components/CompanyList/CompanyList';
import CompanyPage from "./components/CompanyPage/CompanyPage";
import GymPage from './components/GymPage/GymPage';
import EditCompany from './components/EditCompany/EditCompany';
import CreateCompany from "./components/CreateCompany/CreateCompany";
import CreateSub from "./components/Subscription/CreateSub";
import EditSubscription from "./components/Subscription/EditSub";
import CompanyVisits from "./components/Visits/CompanyVisits";

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user/:userId" element={<Profile />} />
                    <Route path="/user/:userId/edit" element={<EditProfile />} />
                    <Route path="/companies/:companyId" element={<CompanyPage />} />
                    <Route path="/gym/:gymId" element={<GymPage />} />
                    <Route path="/company/:companyId/edit" element={<EditCompany />} />
                    <Route path="/company/create" element={<CreateCompany />} />
                    <Route path="/subscription/:gymId/create" element={<CreateSub />} />
                    <Route path="/subscriptions/edit/:subscriptionId" element={<EditSubscription />} />
                    <Route path="/visits/company/:companyId" element={<CompanyVisits />} />
                    <Route path="/" element={
                        <>
                            <main>
                                <h1>Welcome to SportSync!</h1>
                                <p>Your ultimate sports synchronization app. Log in to have full access to
                                    functionality.</p>
                            </main>
                            {<CompanyList />}
                        </>
                    }/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
