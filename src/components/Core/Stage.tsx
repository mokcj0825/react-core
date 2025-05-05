import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DeploymentRenderer } from './gameCore/renderer/DeploymentRenderer';
import { BattlefieldRenderer } from './gameCore/renderer/BattlefieldRenderer';
import { ChatCore } from './gameCore/chatCore/ChatCore';

interface StageData {
  stageId: string;
  name: string;
  description: string;
  mapId: string;
  stageEvent?: Array<{
    trigger: string;
    invoke: string;
    content: string;
  }>;
}

interface ChatState {
  isVisible: boolean;
  dialogScriptId: string;
}

const Stage: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const [stageData, setStageData] = useState<StageData | null>(null);
  const [deploymentDone, setDeploymentDone] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    isVisible: false,
    dialogScriptId: ''
  });

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

  // Process stage event
  const processStageEvent = (triggerType: string) => {
    if (!stageData?.stageEvent) return;
    
    // Find any events with the matching trigger
    const matchingEvents = stageData.stageEvent.filter(
      event => event.trigger === triggerType
    );
    
    if (matchingEvents.length === 0) {
      console.log(`No ${triggerType} events found in stage data`);
      return;
    }
    
    // Process each matching event
    matchingEvents.forEach(event => {
      console.log(`Processing ${triggerType} event with action: ${event.invoke}`);
      
      switch (event.invoke) {
        case 'chat':
          console.log(`Showing chat with dialog: ${event.content}`);
          setChatState({
            isVisible: true,
            dialogScriptId: event.content
          });
          break;
        default:
          console.log(`Unknown invoke action: ${event.invoke}`);
      }
    });
  };

  // Listen for POST_DEPLOY trigger
  useEffect(() => {
    const handlePostDeployTrigger = () => {
      console.log('Stage component received POST_DEPLOY trigger');
      processStageEvent('POST_DEPLOY');
    };

    window.addEventListener('post-deploy-trigger', handlePostDeployTrigger);
    return () => {
      window.removeEventListener('post-deploy-trigger', handlePostDeployTrigger);
    };
  }, [stageData]);

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
          {chatState.isVisible && <ChatCore dialogScriptId={chatState.dialogScriptId} onChatEnd={() => setChatState(
            { isVisible: false, dialogScriptId: '' })} />}
        </div>
      </div>
    </div>
  );
};

export default Stage; 