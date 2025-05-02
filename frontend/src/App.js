import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import AssessmentSummary from './pages/AssessmentSummary';
import ProtectedRoute from './components/protectedRoute';
import Skills from './pages/Skills'
import Navbar from './components/Navbar';
import axios from 'axios';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/user-info`, {
                    withCredentials: true,
                });
                setUser(res.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);



  return (
    <Router>
     <Navbar />
        <Routes>
      <Route path="/" element={<Home  />} />
      <Route path="/assessment"  element={
        <ProtectedRoute user={user}>
          <Assessment user={user} />
        </ProtectedRoute>
      } />
      <Route path="/assessmentsummary"  element={
        <ProtectedRoute user={user}>
          <AssessmentSummary user={user} />
        </ProtectedRoute>
      } />
      <Route path="/skills" element={<Skills />} />
    </Routes>

    </Router>
  )
}

export default App;