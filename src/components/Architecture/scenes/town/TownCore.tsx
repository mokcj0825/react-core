import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheater } from '../../TheaterCore';

interface TownLocation {
  enableAt: {
    story: string;
    chapter: number;
    operator?: string; // '>=', '<=', '==', '>', '<', etc.
  };
  name: string;
  destination?: string;
}

interface TownConfig {
  [key: string]: TownLocation;
}

interface StackSceneCommand {
  command: 'STACK_SCENE';
  scene: string;
  sceneResource: string;
  condition?: string;
}

interface WriteValueCommand {
  command: 'WRITE_VALUE';
  target: string;
  operation: string;
  value: any;
  condition?: string;
}

interface InvokeSceneCommand {
  command: 'INVOKE_SCENE';
  scene: string;
  sceneResource: string;
  condition?: string;
}

type OnRenderCompletedCommand = StackSceneCommand | WriteValueCommand | InvokeSceneCommand;

interface TownData {
  townName?: string;
  backgroundResource?: string;
  townConfig?: TownConfig;
  onRenderCompleted?: OnRenderCompletedCommand[];
}

const TownCore: React.FC = () => {
  const { getSceneResource, dispatchSceneCommand } = useTheater();
  const sceneResource = getSceneResource('town');
  const [townData, setTownData] = useState<TownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the common container styles
  const containerStyles = useMemo(() => ({
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  }), []);

  // Function to evaluate condition strings like "story.main == 0"
  const evaluateCondition = useCallback((condition: string): boolean => {
    if (!condition) return true; // No condition means always execute
    
    // Parse condition like "story.main == 0"
    const parts = condition.split(/\s*(==|!=|>=|<=|>|<)\s*/);
    if (parts.length !== 3) return true; // Invalid condition, default to true
    
    const [key, operator, value] = parts;
    const currentValue = localStorage.getItem(key) || '0';
    const compareValue = value;
    
    switch (operator) {
      case '==':
        return currentValue === compareValue;
      case '!=':
        return currentValue !== compareValue;
      case '>=':
        return parseFloat(currentValue) >= parseFloat(compareValue);
      case '<=':
        return parseFloat(currentValue) <= parseFloat(compareValue);
      case '>':
        return parseFloat(currentValue) > parseFloat(compareValue);
      case '<':
        return parseFloat(currentValue) < parseFloat(compareValue);
      default:
        return true;
    }
  }, []);

  // Function to check if a location is enabled based on localStorage and operator
  const isLocationEnabled = useCallback((location: TownLocation): boolean => {
    const { enableAt } = location;
    const storyKey = `story.${enableAt.story}`;
    const currentChapter = parseInt(localStorage.getItem(storyKey) || '0');
    const requiredChapter = enableAt.chapter;
    const operator = enableAt.operator || '>='; // Default to >= if not specified

    switch (operator) {
      case '>=':
        return currentChapter >= requiredChapter;
      case '<=':
        return currentChapter <= requiredChapter;
      case '==':
        return currentChapter === requiredChapter;
      case '>':
        return currentChapter > requiredChapter;
      case '<':
        return currentChapter < requiredChapter;
      case '!=':
        return currentChapter !== requiredChapter;
      default:
        return currentChapter >= requiredChapter; // Default behavior
    }
  }, []);

  // Memoize handleLocationClick to prevent recreation
  const handleLocationClick = useCallback((locationKey: string, location: TownLocation) => {
    console.log(`Location clicked: ${locationKey}`, location);
    
    // If location has a destination, navigate to it
    if (location.destination) {
      dispatchSceneCommand({
        command: 'INVOKE_SCENE',
        scene: 'town',
        sceneResource: location.destination
      });
    }
  }, [dispatchSceneCommand]);

  // Single useEffect to handle everything
  useEffect(() => {
    console.log('TownCore useEffect triggered with sceneResource:', sceneResource);
    
    if (!sceneResource) {
      setLoading(false);
      return;
    }

    // Reset state
    setTownData(null);
    setError(null);
    setLoading(true);

    // Fetch data
    const fetchData = async () => {
      try {
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        const response = await fetch(`/architecture/${selectedTestCase}/${sceneResource}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch town data: ${response.status}`);
        }
        const data = await response.json();
        console.log('town data', data);
        setTownData(data);
        setLoading(false);
        
        // Handle onRenderCompleted immediately after data loads
        if (data.onRenderCompleted && Array.isArray(data.onRenderCompleted)) {
          data.onRenderCompleted.forEach((command: OnRenderCompletedCommand) => {
            // Check condition first
            if (command.condition && !evaluateCondition(command.condition)) {
              console.log(`Command ${command.command} skipped due to condition: ${command.condition}`);
              return;
            }
            
            switch (command.command) {
              case 'STACK_SCENE':
              case 'INVOKE_SCENE':
                dispatchSceneCommand(command as any);
                break;
              case 'WRITE_VALUE':
                // Handle WRITE_VALUE command to update localStorage
                if (command.target && command.value !== undefined) {
                  localStorage.setItem(command.target, String(command.value));
                  console.log(`WRITE_VALUE: Set ${command.target} = ${command.value}`);
                }
                break;
              default:
                console.warn('Unknown command in onRenderCompleted:', (command as any).command);
            }
          });
        }
      } catch (err) {
        console.log('Error fetching town data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, [sceneResource]);

  if (loading) {
    return <div>Loading town data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!townData) {
    return <div>No town data available</div>;
  }

  return (
    <div style={containerStyles}>
      {/* Background */}
      {townData.backgroundResource && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(/architecture/test-case-004/background/${townData.backgroundResource})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />
      )}
      
      {/* Town Name - Static at top-left corner */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 3,
        padding: '10px 15px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '4px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        {townData.townName || 'N/A'}
      </div>
      
      {/* Town Locations */}
      {townData.townConfig && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px'
            }}>
              {Object.entries(townData.townConfig)
                .filter(([key, location]) => isLocationEnabled(location))
                .map(([key, location]) => (
                <button
                  key={key}
                  onClick={() => handleLocationClick(key, location)}
                  style={{
                    padding: '10px',
                    border: '2px solid #34A853',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(52, 168, 83, 0.1)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(52, 168, 83, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(52, 168, 83, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TownCore); 