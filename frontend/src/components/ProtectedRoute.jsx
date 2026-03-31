import DisclaimerBanner from './DisclaimerBanner';

const ProtectedRoute = ({ children }) => {
  // DEMO MODE: Auth bypass - always allow access
  return (
    <>
      <DisclaimerBanner />
      {children}
    </>
  );
};

export default ProtectedRoute;
