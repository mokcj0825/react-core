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

  // Render split UI with tutorial and gameplay zones
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundImage: rogueData.backgroundResource ? `url(/architecture/test-case-004/background/${rogueData.backgroundResource})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex'
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
          transition: 'background-color 0.2s',
          zIndex: 1000
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
      
      {/* Tutorial Zone (Left Side) */}
      <div style={{
        width: '50%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{
          color: 'white',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          Tutorial
        </h2>
        
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {/* Hardcoded tutorial list */}
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          >
            <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '18px' }}>
              Basic Controls
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '14px' }}>
              Learn the basic controls and movement mechanics
            </p>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          >
            <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '18px' }}>
              Combat System
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '14px' }}>
              Understanding the turn-based combat mechanics
            </p>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          >
            <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '18px' }}>
              Character Classes
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '14px' }}>
              Learn about different character classes and their abilities
            </p>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          >
            <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '18px' }}>
              Advanced Strategies
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '14px' }}>
              Master advanced combat strategies and tactics
            </p>
          </div>
        </div>
      </div>
      
      {/* Gameplay Zone (Right Side) */}
      <div style={{
        width: '50%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{
          color: 'white',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          Gameplay Modes
        </h2>
        
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          justifyContent: 'center'
        }}>
          {rogueData.mode && rogueData.mode.map((mode, index) => (
            <button
              key={index}
              onClick={() => handleModeSelect(mode.loadComponent)}
              style={{
                padding: '20px',
                backgroundColor: 'rgba(255, 107, 107, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s',
                backdropFilter: 'blur(5px)',
                fontWeight: 'bold',
                fontSize: '18px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 82, 82, 0.9)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {mode.name}
              </div>
              <div style={{ 
                fontSize: '14px', 
                opacity: 0.9,
                fontWeight: 'normal'
              }}>
                {mode.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RogueCore;
