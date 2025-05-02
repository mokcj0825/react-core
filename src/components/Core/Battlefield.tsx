import React from 'react';
import { useParams } from 'react-router-dom';
import { BattlefieldRenderer } from './gameCore/renderer/BattlefieldRenderer';

const Battlefield: React.FC = () => {
  const { stageId = 'map-0001' } = useParams<{ stageId?: string }>();
  return <BattlefieldRenderer stageId={stageId} />;
};

export default Battlefield; 