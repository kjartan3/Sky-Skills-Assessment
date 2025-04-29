import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        // Redirect unauthenticated users to login
        return <Navigate to="/" />;
    }

    // Render protected content for authenticated users
    return children;
};

export default ProtectedRoute;
