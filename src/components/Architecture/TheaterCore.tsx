import React, { useState, createContext, useContext, useCallback, useEffect } from 'react';
import Theater from './Theater';
import { SceneCommand, SceneCommandUtils } from "./commands/SceneCommand.ts";
import { Scene } from './commands/Scene.ts';
import {TheaterCommand, TheaterCommandUtils} from "./commands/TheaterCommand.ts";

// Context for providing event dispatch to nested components
interface TheaterContextType {
  dispatchTheaterEvent: (event: TheaterCommand) => void;
  dispatchSceneCommand: (command: SceneCommand) => void;
  scenes: Record<Scene, boolean>;
  sceneResources: Record<Scene, string | null>;
  getSceneResource: (scene: Scene) => string | null;
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
  
  // State to track scene resources for each scene type
  const [sceneResources, setSceneResources] = useState<Record<Scene, string | null>>({
    homeScreen: null,
    chat: null,
    town: null,
    deployment: null,
    battlefield: null,
    inventory: null
  });

  // Add command queue state
  const [commandQueue, setCommandQueue] = useState<SceneCommand[]>([]);
  const [isExecutingCommands, setIsExecutingCommands] = useState(false);

  // Command handler for scene commands
  const handleSceneCommand = async (command: SceneCommand) => {
    console.log('Scene command received:', command);
    
    switch (command.command) {
      case 'INVOKE_SCENE':
        const newScenes = SceneCommandUtils.getNewSceneState(command.scene);
        setScenes(newScenes);
        setSceneResources(prev => ({
          ...prev,
          [command.scene]: command.sceneResource
        }));
        break;
      case 'STACK_SCENE':
        // Keep existing scenes visible and add the new scene
        setScenes(prev => ({
          ...prev,
          [command.scene]: true
        }));
        setSceneResources(prev => ({
          ...prev,
          [command.scene]: command.sceneResource
        }));
        break;
      case 'HIDE_SCENE':
        // Hide the specified scene while preserving others
        setScenes(prev => ({
          ...prev,
          [command.scene]: false
        }));
        break;
      case 'INVOKE_SCRIPT':
        await SceneCommandUtils.executeScript(command.script, command.entryPoint);
        break;
      case 'RESET_STATE':
        await SceneCommandUtils.resetState();
        break;
      default:
        console.warn('Unknown scene command:', command);
    }
  };

  // Function to execute next command in queue
  const executeNextCommand = useCallback(async () => {
    if (commandQueue.length === 0) {
      setIsExecutingCommands(false);
      return;
    }

    const nextCommand = commandQueue[0];
    try {
      await handleSceneCommand(nextCommand);
      // Only remove the command after it's successfully executed
      setCommandQueue(prev => prev.slice(1));
    } catch (error) {
      console.error('Error executing command:', error);
      // Remove the failed command to continue with the queue
      setCommandQueue(prev => prev.slice(1));
    }
  }, [commandQueue]);

  // Effect to process command queue
  useEffect(() => {
    const processQueue = async () => {
      if (!isExecutingCommands && commandQueue.length > 0) {
        setIsExecutingCommands(true);
        await executeNextCommand();
        // After command is executed, set isExecutingCommands to false
        // This will trigger the effect again if there are more commands
        setIsExecutingCommands(false);
      }
    };

    processQueue();
  }, [commandQueue, isExecutingCommands, executeNextCommand]);

  // Event handler for theater events
  const handleTheaterEvent = async (event: TheaterCommand) => {
    console.log('Theater event received:', event);
    
    switch (event.type) {
      case 'CHANGE_SCENE':
        setScenes(event.payload);
        break;
      case 'START_GAME':
        try {
          console.log('Start game event - fetching initialization data');
          const commands = await TheaterCommandUtils.loadInitCommand();
          setCommandQueue(commands);
        } catch (error) {
          console.error('Error loading initialization data:', error);
        }
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
    sceneResources,
    getSceneResource: (scene: Scene) => sceneResources[scene]
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