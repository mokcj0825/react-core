import React from 'react';

interface CharacterSpriteProps {
  characterId: string;
  imageUrl: string;
  position: 'left' | 'right' | 'center';
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry';
  scale?: number;
  offset?: {
    x?: number;
    y?: number;
  };
  zIndex?: number;
  isActive?: boolean;
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  characterId,
  imageUrl,
  position,
  emotion = 'neutral',
  scale = 1,
  offset = { x: 0, y: 0 },
  zIndex = 2,
  isActive = true
}) => {
  const getPositionStyles = () => {
    const basePosition = {
      left: position === 'left' ? '5%' : position === 'center' ? '50%' : 'auto',
      right: position === 'right' ? '5%' : 'auto',
      transform: position === 'center' 
        ? `translateX(-50%) scale(${scale})` 
        : `scale(${scale})`,
      opacity: isActive ? 1 : 0.5,
      filter: isActive ? 'none' : 'grayscale(100%)',
    };

    return {
      ...basePosition,
      bottom: `calc(20% + ${offset.y || 0}px)`,
      marginLeft: offset.x || 0,
    };
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '300px',
        height: '400px',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        zIndex,
        transition: 'all 0.3s ease-in-out',
        ...getPositionStyles()
      }}
    />
  );
};

export default CharacterSprite; 