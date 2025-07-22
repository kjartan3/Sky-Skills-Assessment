import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import AssessmentSummary from './pages/AssessmentSummary';
import ProtectedRoute from './components/protectedRoute';
import Skills from './pages/Skills'
import Navbar from './components/Navbar';
import AssessmentOutro from './pages/AssessmentOutro'
import Dashboard from './pages/Dashboard';
import ComplianceModal from './components/Compliance/ComplianceModal';
import { allowedUserIds } from './components/helper/allowedUsers';




const App = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showComplianceModal, setShowComplianceModal] = useState(false);

    useEffect(() => {
      const fetchUserInfo = async () => {
          try {
              const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/user-info`, {
                  credentials: 'include',
                  headers: {
                      'Accept': 'application/json'
                  }
              });
              
              if (response.ok) {
                  const userData = await response.json();
                  setUser(userData);
              } else {
                  // Clear user state if unauthorized
                  setUser(null);
              }
          } catch (error) {
              console.error('Error fetching user info:', error);
              setUser(null);
          } finally {
              setIsLoading(false);
          }
      };
      
      fetchUserInfo();
  }, []);

useEffect(() => {
        // Check if this is a return from SAML auth (might have SAMLResponse in URL)
        const url = new URL(window.location.href);
        if (url.pathname === '/auth/login/callback' || url.searchParams.has('SAMLResponse')) {
            console.log("Detected SAML callback - handling authentication response");
            // The backend will handle the actual SAML processing
        }
    }, []);

useEffect(() => {
  const acknowledged = sessionStorage.getItem("dataConsentAcknowledged");
  if (!acknowledged) setShowComplianceModal(true);
}, []);

const handleComplianceAcknowledgement = () => {
  sessionStorage.setItem("dataConsentAcknowledged", "true");
  setShowComplianceModal(false);
};
    
    if (isLoading) {
        return <div>Loading authentication...</div>;
    }



    return (
      <Router>
         {showComplianceModal && (
            <ComplianceModal onAcknowledge={handleComplianceAcknowledgement} />
        )}
          <Navbar user={user} />
          <Routes>
          <Route path="/" element={<Home user={user} />} />

              <Route 
                  path="/assessment" 
                  element={
                      <ProtectedRoute user={user}>
                          <Assessment user={user} />
                      </ProtectedRoute>
                  } 
              />
              <Route 
                  path="/assessmentsummary" 
                  element={
                      <ProtectedRoute user={user}>
                          <AssessmentSummary user={user} />
                      </ProtectedRoute>
                  } 
              />
              <Route path="/skills" element={<Skills />} />
              
              {/* Add a catch-all SAML callback route */}
              <Route path="/auth/login/callback" element={<Navigate to="/" />} />
              <Route path="/assessmentoutro" element={<AssessmentOutro  />} />
              <Route
                path="/dashboard"
                element={
                    allowedUserIds.includes(user?.userId) ? (
                    <Dashboard user={user} />
                    ) : (
                    <Navigate to="/" />
                    )
                }
                />
          </Routes>
      </Router>
  );
    
}

export default App;