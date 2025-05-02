import React from 'react';
import { useParams } from 'react-router-dom';
import { DeploymentRenderer } from './gameCore/renderer/DeploymentRenderer';

const Deployment: React.FC = () => {
  const { stageId = 'map-0001' } = useParams<{ stageId?: string }>();
  return <DeploymentRenderer stageId={stageId} />;
};

export default Deployment; 