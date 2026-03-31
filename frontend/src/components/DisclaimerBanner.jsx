const DisclaimerBanner = () => {
  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 107, 107, 0.06) 100%)',
      borderBottom: '1px solid rgba(255, 165, 0, 0.15)',
      padding: '10px 24px',
      textAlign: 'center',
      fontSize: '12px',
      color: '#ffa94d',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      letterSpacing: '0.2px',
    }}>
      <span style={{fontSize: '14px'}}>⚠️</span>
      <span>
        <strong>Medical Disclaimer:</strong> This application provides general dietary and fitness guidance. 
        It is not a substitute for professional medical advice, diagnosis, or treatment.
      </span>
    </div>
  );
};

export default DisclaimerBanner;
