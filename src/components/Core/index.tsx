import React from 'react';
import { GameRenderer } from './gameCore/renderer/GameRenderer';
interface CoreProps {
  stageId?: string;
}

const Core: React.FC<CoreProps> = ({ stageId = '0001' }) => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      <GameRenderer stageId={stageId} />
    </div>
  );
};

export default Core;