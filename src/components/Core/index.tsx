import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { BattlefieldRenderer } from './gameCore/renderer/BattlefieldRenderer';
import { DeploymentRenderer } from './gameCore/renderer/DeploymentRenderer';

// Battlefield component with stageId parameter
const Battlefield = () => {
  const { stageId = '0001' } = useParams<{ stageId?: string }>();
  return <BattlefieldRenderer stageId={stageId} />;
};

// Deployment component with stageId parameter
const Deployment = () => {
  const { stageId = '0001' } = useParams<{ stageId?: string }>();
  return <DeploymentRenderer stageId={stageId} />;
};

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