import React from 'react';

const Deployment: React.FC = () => {
  return (
    <div style={wrapper}>
      <div style={{ 
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '4px'
      }}>
        Deployment
      </div>
    </div>
  );
};

export default Deployment;

const wrapper = {
  width: '100%',
  height: '100%',
  border: '2px dashed #FBBC05',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(251, 188, 5, 0.1)'
} as const;