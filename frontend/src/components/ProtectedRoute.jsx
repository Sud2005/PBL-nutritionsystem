import { Navigate } from 'react-router-dom';
import DisclaimerBanner from './DisclaimerBanner';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <DisclaimerBanner />
      {children}
    </>
  );
};

export default ProtectedRoute;
