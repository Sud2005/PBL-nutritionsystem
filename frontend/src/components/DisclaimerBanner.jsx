const DisclaimerBanner = () => {
    return (
      <div style={{
          background: '#fffbe1',
          borderBottom: '1px solid #fde68a',
          color: '#854d0e',
          padding: '12px 20px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 500
      }}>
        <span style={{marginRight: '8px'}}>⚠️</span>
        <strong>Medical Disclaimer:</strong> This application provides general dietary and fitness guidance. It is not a substitute for professional medical advice, diagnosis, or treatment.
      </div>
    );
  };
  
  export default DisclaimerBanner;
