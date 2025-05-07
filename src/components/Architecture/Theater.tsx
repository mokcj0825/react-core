import React from 'react';
import { 
  HomeScreen, 
  Chat, 
  Town, 
  Deployment, 
  Battlefield, 
  Inventory 
} from './scenes';

interface TheaterProps {
  width?: string;
  height?: string;
  scenes?: {
    homeScreen: boolean;
    chat: boolean;
    town: boolean;
    deployment: boolean;
    battlefield: boolean;
    inventory: boolean;
  };
}

// Z-index constants
const Z_INDEX = {
  BASE: 1,
  TOWN_DEPLOYMENT_BATTLEFIELD: 10,
  CHAT_INVENTORY: 20
};

const Theater: React.FC<TheaterProps> = ({ 
  width = '100%', 
  height = '100%',
  scenes = {
    homeScreen: false,
    chat: false,
    town: false,
    deployment: false,
    battlefield: false,
    inventory: false
  }
}) => {
  // Handle case when no scenes are selected
  const noScenesSelected = !Object.values(scenes).some(value => value);

  return (
    <div style={{
      width,
      height,
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '10px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {noScenesSelected && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#999'
        }}>
          No scenes selected. Use the control panel to select scenes.
        </div>
      )}

      {/* Render scenes based on selection */}
      {scenes.homeScreen && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          padding: '10px',
          zIndex: Z_INDEX.BASE
        }}>
          <HomeScreen />
        </div>
      )}
      
      {/* Town, Deployment, and Battlefield have lower z-index */}
      {scenes.town && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          padding: '10px',
          zIndex: Z_INDEX.TOWN_DEPLOYMENT_BATTLEFIELD
        }}>
          <Town />
        </div>
      )}
      
      {scenes.deployment && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          padding: '10px',
          zIndex: Z_INDEX.TOWN_DEPLOYMENT_BATTLEFIELD
        }}>
          <Deployment />
        </div>
      )}
      
      {scenes.battlefield && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          padding: '10px',
          zIndex: Z_INDEX.TOWN_DEPLOYMENT_BATTLEFIELD
        }}>
          <Battlefield />
        </div>
      )}
      
      {/* Chat and Inventory have higher z-index */}
      {scenes.chat && (
        <div style={{ 
          position: 'absolute', 
          top: 0,
          left: 0, 
          right: 0, 
          bottom: 0,
          padding: '10px',
          zIndex: Z_INDEX.CHAT_INVENTORY
        }}>
          <Chat />
        </div>
      )}
      
      {scenes.inventory && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          padding: '10px',
          zIndex: Z_INDEX.CHAT_INVENTORY
        }}>
          <Inventory />
        </div>
      )}
    </div>
  );
};

export default Theater; 