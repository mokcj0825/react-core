import React, { useState, useEffect } from 'react';
import { useTheater } from '../../TheaterCore';

interface RogueMode {
  name: string;
  description: string;
  loadComponent: string;
}

interface RogueData {
  description: string;
  backgroundResource?: string;
  mode: RogueMode[];
  onRenderCompleted?: any[];
  onClosed?: any[];
}

const RogueCore: React.FC = () => {
  const { getSceneResource, dispatchSceneCommand } = useTheater();
  const sceneResource = getSceneResource('rogue');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rogueData, setRogueData] = useState<RogueData | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [DynamicComponent, setDynamicComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (!sceneResource) {
      setLoading(false);
      return;
    }

    const fetchRogueData = async () => {
      try {
        setLoading(true);
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        const response = await fetch(`/architecture/${selectedTestCase}/${sceneResource}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch rogue data: ${response.status}`);
        }
        const data = await response.json();
        setRogueData(data);
        
        // Handle onRenderCompleted if it exists
        if (data.onRenderCompleted && Array.isArray(data.onRenderCompleted)) {
          data.onRenderCompleted.forEach((command: any) => {
            dispatchSceneCommand(command);
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rogue data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchRogueData();
  }, [sceneResource, dispatchSceneCommand]);

  const handleModeSelect = async (loadComponent: string) => {
    try {
      setSelectedMode(loadComponent);
      
      // Dynamically import the component
      const module = await import(`../../rogue/${loadComponent}`);
      const Component = module.default;
      setDynamicComponent(() => Component);
    } catch (err) {
      console.error('Error loading rogue mode component:', err);
      setError(`Failed to load component: ${loadComponent}`);
    }
  };

  const handleBackToSelection = () => {
    setSelectedMode(null);
    setDynamicComponent(null);
    setError(null);
  };

  const handleClose = () => {
    // Execute onClosed commands if they exist
    if (rogueData?.onClosed && Array.isArray(rogueData.onClosed)) {
      rogueData.onClosed.forEach((command: any) => {
        dispatchSceneCommand(command);
      });
    }
    
    // Hide the rogue scene
    dispatchSceneCommand({ command: 'HIDE_SCENE', scene: 'rogue' });
  };

  if (loading) {
    return <div>Loading rogue mode...</div>;
  }

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        border: '2px dashed #ff6b6b',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#ff6b6b', marginBottom: '10px' }}>Error: {error}</div>
        <button 
          onClick={handleBackToSelection}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Selection
        </button>
      </div>
    );
  }

  if (!rogueData) {
    return <div>No rogue data available</div>;
  }

  // If a mode is selected and component is loaded, render it
  if (selectedMode && DynamicComponent) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <button 
          onClick={handleBackToSelection}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 1000,
            padding: '8px 16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        <DynamicComponent />
      </div>
    );
  }

  // Render mode selection screen
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundImage: rogueData.backgroundResource ? `url(/architecture/test-case-004/background/${rogueData.backgroundResource})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          backdropFilter: 'blur(5px)',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }}
      >
        Close
      </button>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '400px',
        padding: '20px'
      }}>
        {rogueData.mode && rogueData.mode.map((mode, index) => (
          <button
            key={index}
            onClick={() => handleModeSelect(mode.loadComponent)}
            style={{
              padding: '15px 20px',
              backgroundColor: 'rgba(255, 107, 107, 0.9)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.2s',
              backdropFilter: 'blur(5px)',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 82, 82, 0.9)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.9)';
            }}
          >
            {mode.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RogueCore;
