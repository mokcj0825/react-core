import React, { useState, useEffect } from 'react';
import { useTheater } from '../../TheaterCore';

const BattlefieldCore: React.FC = () => {
  const { sceneResource, dispatchSceneCommand } = useTheater();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sceneResource) {
      setLoading(false);
      return;
    }

    const fetchBattlefieldData = async () => {
      try {
        setLoading(true);
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        const response = await fetch(`/architecture/${selectedTestCase}/${sceneResource}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch battlefield data: ${response.status}`);
        }
        const data = await response.json();
        
        // Only execute onRenderCompleted if it's from the battlefield scene
        if (data.onRenderCompleted && sceneResource.includes('battlefield')) {
          data.onRenderCompleted.forEach((command: any) => {
            dispatchSceneCommand(command);
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching battlefield data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchBattlefieldData();
  }, [sceneResource, dispatchSceneCommand]);

  if (loading) {
    return <div>Loading battlefield data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ 
      padding: '10px 20px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div>Battlefield</div>
      <div style={{ fontSize: '0.8em', color: '#666' }}>
        This is the battlefield scene. It can stack other scenes on top.
      </div>
    </div>
  );
};

export default React.memo(BattlefieldCore);
