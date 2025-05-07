import React from 'react';
import TheaterCore from './TheaterCore';
import ControlPanel from './ControlPanel';

const Architecture: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '70%',
        height: '70%'
      }}>
        <TheaterCore />
      </div>
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '30%',
        height: '100%'
      }}>
        <ControlPanel />
      </div>
    </div>
  );
};

export default Architecture;
