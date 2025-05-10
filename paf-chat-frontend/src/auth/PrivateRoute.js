// PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a fancy spinner
  }

  return user ? children : <Navigate to="/signin" />;
}

export default PrivateRoute;
