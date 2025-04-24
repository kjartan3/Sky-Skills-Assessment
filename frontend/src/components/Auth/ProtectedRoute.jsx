import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = !!sessionStorage.getItem('token');

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
