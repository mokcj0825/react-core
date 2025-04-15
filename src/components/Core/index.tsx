import React from 'react';
import { useParams } from 'react-router-dom';
import { BattlefieldRenderer } from './gameCore/renderer/BattlefieldRenderer.tsx';

const Core: React.FC = () => {
  const { stageId = '0001' } = useParams<{ stageId?: string }>();
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      <BattlefieldRenderer stageId={stageId} />
    </div>
  );
};

export default Core;