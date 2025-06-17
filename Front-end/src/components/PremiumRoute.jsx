import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PremiumRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return user?.premium ? children : <Navigate to="/premium/dashboard" replace />;
}

export default PremiumRoute;