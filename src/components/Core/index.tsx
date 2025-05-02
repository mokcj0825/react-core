import React from 'react';
import { Outlet } from 'react-router-dom';

const Core: React.FC = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      <Outlet />
    </div>
  );
};

export default Core;