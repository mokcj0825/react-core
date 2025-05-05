import React, { memo } from 'react';

// Constants for configuration
const BACKGROUND_CONFIG = {
  PATH: '/background/',
  TRANSITION_DURATION: '0.3s',
};

// Define styles with TypeScript's as const assertion
const backgroundContainerStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0)',
} as const;

const backgroundImageStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover' as const,
  backgroundPosition: 'center' as const,
  backgroundRepeat: 'no-repeat' as const,
  opacity: 1,
  transition: `opacity ${BACKGROUND_CONFIG.TRANSITION_DURATION} ease`,
} as const;

interface BackgroundLayerProps {
  backgroundImage: string | null;
}

/**
 * BackgroundLayer component
 * 
 * Responsible only for displaying the background image
 * Receives background image from parent component
 * Completely isolated from other components
 */
const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ backgroundImage }) => {
  console.log('BackgroundLayer rendered with:', backgroundImage);
  
  return (
    <div style={backgroundContainerStyle}>
      {backgroundImage && (
        <div
          id="dialog-background"
          style={{
            ...backgroundImageStyle,
            backgroundImage: `url(${BACKGROUND_CONFIG.PATH}${backgroundImage})`,
          }}
        />
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(BackgroundLayer); 