import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Battlefield from './Battlefield';
import { DeploymentRenderer } from './gameCore/renderer/DeploymentRenderer';
import { BattlefieldRenderer } from './gameCore/renderer/BattlefieldRenderer';

interface StageData {
  stageId: string;
  name: string;
  description: string;
  mapId: string;
}

// This is a placeholder chat component that can be replaced with any chat implementation
const ChatPlaceholder: React.FC<{ stageId: string }> = ({ stageId }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '200px',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      padding: '16px'
    }}>
      <h3>Chat Integration Area</h3>
      <p>Replace this component with your chat implementation</p>
      <p>Current Stage: {stageId}</p>
    </div>
  );
};

const Stage: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const [stageData, setStageData] = useState<StageData | null>(null);
  const [deploymentDone, setDeploymentDone] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const loadStageData = async () => {
      try {
        const response = await fetch(`/stages/stage-${stageId}.json`);
        if (response.ok) {
          const data = await response.json();
          setStageData(data);
        }
      } catch (error) {
        console.error('Failed to load stage data:', error);
      }
    };

    loadStageData();
  }, [stageId]);

  // Listen for deployment updates
  useEffect(() => {
    const handleDeploymentUpdate = () => {
      console.log('Deployment data updated in Stage component');
      setDeploymentDone(true);
    };

    window.addEventListener('deployment-updated', handleDeploymentUpdate);
    return () => {
      window.removeEventListener('deployment-updated', handleDeploymentUpdate);
    };
  }, []);

  if (!stageId || !stageData) {
    return <div>Loading stage...</div>;
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}>
          {!deploymentDone && <DeploymentRenderer stageId={stageData.mapId} />}
          {deploymentDone && <BattlefieldRenderer stageId={stageData.mapId} />}
          {showChat && <ChatPlaceholder stageId={stageId} />}
        </div>
      </div>
    </div>
  );
};

export default Stage; 