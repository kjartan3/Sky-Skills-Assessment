import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import AssessmentSummary from './pages/AssessmentSummary';
import ProtectedRoute from './components/protectedRoute';
import Skills from './pages/Skills'
import Navbar from './components/Navbar'
const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:5000/auth/user-info', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
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
      <Route path="/" element={<Home user={user} />} />
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