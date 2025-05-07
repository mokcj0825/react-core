import React from 'react';

const Battlefield: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      border: '2px dashed #9C27B0',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(156, 39, 176, 0.1)'
    }}>
      <div style={{ 
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '4px'
      }}>
        Battlefield
      </div>
    </div>
  );
};

export default Battlefield; 