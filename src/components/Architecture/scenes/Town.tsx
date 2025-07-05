import React from 'react';
import TownCore from './town/TownCore';

const Town: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      border: '2px dashed #34A853',
      borderRadius: '4px',
      backgroundColor: 'rgba(52, 168, 83, 0.1)'
    }}>
      <TownCore />
    </div>
  );
};

export default Town;