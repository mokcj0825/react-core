import React, { useEffect } from 'react';
import { useTheater } from '../TheaterCore';
import BattlefieldCore from './battlefield/BattlefieldCore';

const Battlefield: React.FC = () => {
  const { getSceneResource, dispatchSceneCommand } = useTheater();
  const sceneResource = getSceneResource('battlefield');

  useEffect(() => {
    if (sceneResource) {
      // Load and execute the scene resource
      fetch(`/architecture/${localStorage.getItem('selectedTestCase') || 'test-case-001'}/${sceneResource}`)
        .then(response => response.json())
        .then(data => {
          if (data.onRenderCompleted) {
            data.onRenderCompleted.forEach((command: any) => {
              dispatchSceneCommand(command);
            });
          }
        })
        .catch(error => {
          console.error('Error loading battlefield scene resource:', error);
        });
    }
  }, [sceneResource, dispatchSceneCommand]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      border: '2px dashed #9C27B0',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(156, 39, 176, 0.1)'
    }}>
      <BattlefieldCore />
    </div>
  );
};

export default Battlefield; 