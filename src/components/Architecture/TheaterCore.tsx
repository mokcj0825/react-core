import React, { useState, createContext, useContext } from 'react';
import Theater from './Theater';

// Define the scene types
type Scene = 'homeScreen' | 'chat' | 'town' | 'deployment' | 'battlefield' | 'inventory';

// Define the event types that can be emitted to the theater
type TheaterEvent = 
  | { type: 'CHANGE_SCENE'; payload: Record<Scene, boolean> }
  | { type: 'START_GAME' }
  | { type: 'LOAD_GAME' }
  | { type: 'SHOW_SETTINGS' }
  | { type: 'EXIT_GAME' };

// Define the command types
type SceneCommand = 
  | {
      command: 'INVOKE_SCENE';
      scene: Scene;
      sceneResource: string;
    }
  | {
      command: 'INVOKE_SCRIPT';
      script: string;
      entryPoint: string;
    };

// Context for providing event dispatch to nested components
interface TheaterContextType {
  dispatchTheaterEvent: (event: TheaterEvent) => void;
  dispatchSceneCommand: (command: SceneCommand) => void;
  scenes: Record<Scene, boolean>;
  sceneResource: string | null;
}

const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

// Hook to use the theater context
export const useTheater = () => {
  const context = useContext(TheaterContext);
  if (!context) {
    throw new Error('useTheater must be used within a TheaterProvider');
  }
  return context;
};

interface TheaterCoreProps {
  width?: string;
  height?: string;
}

const TheaterCore: React.FC<TheaterCoreProps> = ({ width = '100%', height = '100%' }) => {
  // State to track which scenes are displayed
  const [scenes, setScenes] = useState<Record<Scene, boolean>>({
    homeScreen: true,
    chat: false,
    town: false,
    deployment: false,
    battlefield: false,
    inventory: false
  });
  
  // State to track the current scene resource
  const [sceneResource, setSceneResource] = useState<string | null>(null);

  // Command handler for scene commands
  const handleSceneCommand = (command: SceneCommand) => {
    console.log('Scene command received:', command);
    
    switch (command.command) {
      case 'INVOKE_SCENE':
        const newScenes: Record<Scene, boolean> = {
          homeScreen: false,
          chat: false,
          town: false,
          deployment: false,
          battlefield: false,
          inventory: false
        };
        newScenes[command.scene] = true;
        setScenes(newScenes);
        setSceneResource(command.sceneResource);
        break;
      case 'INVOKE_SCRIPT':
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        fetch(`/architecture/${selectedTestCase}/${command.script}`)
          .then(response => response.text())
          .then(scriptContent => {
            // Create a blob URL for the script
            const blob = new Blob([scriptContent], { type: 'application/javascript' });
            const scriptUrl = URL.createObjectURL(blob);
            
            // Load and execute the script
            import(scriptUrl)
              .then(module => {
                if (typeof module[command.entryPoint] === 'function') {
                  module[command.entryPoint]();
                } else {
                  console.error(`Entry point ${command.entryPoint} not found in script`);
                }
                // Clean up the blob URL
                URL.revokeObjectURL(scriptUrl);
              })
              .catch(error => {
                console.error('Error executing script:', error);
              });
          })
          .catch(error => {
            console.error('Error loading script:', error);
          });
        break;
      default:
        console.warn('Unknown scene command:', command);
    }
  };

  // Event handler for theater events
  const handleTheaterEvent = (event: TheaterEvent) => {
    console.log('Theater event received:', event);
    
    switch (event.type) {
      case 'CHANGE_SCENE':
        setScenes(event.payload);
        break;
        
      case 'START_GAME':
        // Logic to start a new game
        console.log('Start game event - fetching initialization data');
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        fetch(`/architecture/${selectedTestCase}/init.json`)
          .then(response => response.json())
          .then(data => {

            switch (data.command) {
              case 'INVOKE_SCENE':
                const scene = data.scene as Scene;
                if (scene in scenes) {
                  handleSceneCommand(data);
                } else {
                  console.warn('Invalid scene type:', scene);
                }
                break;
              case 'INVOKE_SCRIPT':
                console.log('Executing script:', data.script, 'with entry point:', data.entryPoint);
                handleSceneCommand(data);
                break;
              default:
                console.warn('Invalid init.json structure or missing scene');
            }
          })
          .catch(error => {
            console.log('Error fetching initialization data:', error);
          });
        break;
        
      case 'LOAD_GAME':
        // Logic to load a saved game
        console.log('Load game event - would load a saved game here');
        break;
        
      case 'SHOW_SETTINGS':
        // Logic to show settings
        console.log('Settings event - would show settings here');
        break;
        
      case 'EXIT_GAME':
        // Logic to exit the game
        console.log('Exit game event - would handle exit here');
        break;
        
      default:
        console.warn('Unknown theater event:', event);
    }
  };
  
  // Provide the event dispatcher to all theater components
  const contextValue: TheaterContextType = {
    dispatchTheaterEvent: handleTheaterEvent,
    dispatchSceneCommand: handleSceneCommand,
    scenes,
    sceneResource
  };
  
  return (
    <TheaterContext.Provider value={contextValue}>
      <div style={{ width, height, position: 'relative' }}>
        <Theater scenes={scenes} />
      </div>
    </TheaterContext.Provider>
  );
};

export default TheaterCore; 