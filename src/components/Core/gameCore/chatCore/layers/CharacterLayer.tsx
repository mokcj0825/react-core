import React, { useState, useEffect, memo } from 'react';
import { CharacterPosition } from '../execution/ShowCharacter';
import { characterService } from '../services/CharacterService';

// Constants for configuration
const SPRITE_CONFIG = {
  PATH: '/character-sprite/',
  TRANSITION_DURATION: '0.3s',
  POSITIONS: {
    LEFT: {
      LEFT_OFFSET: '10%',
      TRANSFORM: 'translateX(-20%)',
    },
    MIDDLE: {
      LEFT_OFFSET: '50%',
      TRANSFORM: 'translateX(-50%)',
    },
    RIGHT: {
      LEFT_OFFSET: '90%',
      TRANSFORM: 'translateX(-80%)',
    },
  },
  SPRITE_DIMENSIONS: {
    MAX_HEIGHT: '500px',
    MAX_WIDTH: '300px',
    HEIGHT_PERCENTAGE: '80%',
  },
};

// Define styles with TypeScript's as const assertion
const characterContainerStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 2,
  pointerEvents: 'none' as const, // Allow clicks to pass through to layers below
} as const;

const characterImageStyle = {
  height: '100%',
  maxHeight: SPRITE_CONFIG.SPRITE_DIMENSIONS.MAX_HEIGHT,
  maxWidth: SPRITE_CONFIG.SPRITE_DIMENSIONS.MAX_WIDTH,
  objectFit: 'contain' as const,
} as const;

// Function to get position-specific styles
const getCharacterSpriteStyle = (position: CharacterPosition) => {
  let leftOffset: string;
  let transformValue: string;

  switch (position) {
    case CharacterPosition.LEFT:
      leftOffset = SPRITE_CONFIG.POSITIONS.LEFT.LEFT_OFFSET;
      transformValue = SPRITE_CONFIG.POSITIONS.LEFT.TRANSFORM;
      break;
    case CharacterPosition.MIDDLE:
      leftOffset = SPRITE_CONFIG.POSITIONS.MIDDLE.LEFT_OFFSET;
      transformValue = SPRITE_CONFIG.POSITIONS.MIDDLE.TRANSFORM;
      break;
    case CharacterPosition.RIGHT:
      leftOffset = SPRITE_CONFIG.POSITIONS.RIGHT.LEFT_OFFSET;
      transformValue = SPRITE_CONFIG.POSITIONS.RIGHT.TRANSFORM;
      break;
    default:
      leftOffset = SPRITE_CONFIG.POSITIONS.MIDDLE.LEFT_OFFSET;
      transformValue = SPRITE_CONFIG.POSITIONS.MIDDLE.TRANSFORM;
  }

  return {
    position: 'absolute' as const,
    bottom: 0,
    left: leftOffset,
    transform: transformValue,
    height: SPRITE_CONFIG.SPRITE_DIMENSIONS.HEIGHT_PERCENTAGE,
    transition: `opacity ${SPRITE_CONFIG.TRANSITION_DURATION} ease`,
  };
};

interface CharacterLayerProps {
  // Component receives no props - it uses the characterService
}

/**
 * CharacterLayer component
 * 
 * Responsible only for displaying character sprites
 * Listens to the characterService for changes
 * Completely isolated from other components
 */
const CharacterLayer: React.FC<CharacterLayerProps> = () => {
  const [characters, setCharacters] = useState<Record<CharacterPosition, string | null>>(
    characterService.getCharacters()
  );
  
  // Listen for character changes from the service
  useEffect(() => {
    const handleCharacterChange = (newCharacters: Record<CharacterPosition, string | null>) => {
      console.log('Characters changed:', newCharacters);
      setCharacters(newCharacters);
    };
    
    // Subscribe to character changes
    characterService.addChangeListener(handleCharacterChange);
    
    // Clean up subscription
    return () => {
      characterService.removeChangeListener(handleCharacterChange);
    };
  }, []);
  
  console.log('CharacterLayer rendered with:', characters);
  
  return (
    <div style={characterContainerStyle}>
      {Object.entries(characters).map(([position, spriteUrl]) => 
        spriteUrl && (
          <div 
            key={`${position}-${spriteUrl}`}
            style={getCharacterSpriteStyle(position as CharacterPosition)}
          >
            <img 
              style={characterImageStyle}
              src={`${SPRITE_CONFIG.PATH}${spriteUrl}.png`} 
              alt={`Character at ${position}`}
            />
          </div>
        )
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(CharacterLayer); 