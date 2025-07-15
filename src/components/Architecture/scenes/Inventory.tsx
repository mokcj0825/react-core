import React from 'react';

const Inventory: React.FC = () => {
  return (
    <div style={wrapper}>
      <div style={{ 
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '4px'
      }}>
        Inventory
      </div>
    </div>
  );
};

export default Inventory;

const wrapper = {
  width: '100%',
  height: '100%',
  border: '2px dashed #FF5722',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 87, 34, 0.1)'
} as const;