import React, { useRef } from 'react';
import { DeploymentCharacter } from '../types/DeploymentCharacter';

interface Props {
  character: DeploymentCharacter;
  isSelected: boolean;
  isAnimating: boolean;
  onClick: (characterId: number) => void;
  animationConfig?: {
    duration: number;
    scale: number;
  };
  onDragStart?: (character: DeploymentCharacter) => void;
  onDragEnd?: () => void;
  isDeployed?: boolean;
}

export const CharacterRenderer: React.FC<Props> = ({
  character,
  isSelected,
  isAnimating,
  onClick,
  animationConfig = {
    duration: 2000,
    scale: 1.1
  },
  onDragStart,
  onDragEnd,
  isDeployed = false
}) => {
  const spriteRef = useRef<HTMLImageElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(character);
      
      // Set the drag image to be just the sprite
      if (spriteRef.current) {
        e.dataTransfer.setDragImage(spriteRef.current, 24, 24);
      }
    }
  };

  return (
    <div
      onClick={() => onClick(character.id)}
      draggable={!isDeployed}
      onDragStart={handleDragStart}
      onDragEnd={() => onDragEnd?.()}
      style={{
        ...characterCardStyle,
        backgroundColor: isSelected ? '#E8F5E9' : '#fff',
        opacity: isDeployed ? 0.7 : 1,
        cursor: isDeployed ? 'not-allowed' : 'pointer'
      }}
    >
      <div style={characterSpriteContainerStyle}>
        <img 
          ref={spriteRef}
          src={`/sprites/${character.sprite}.svg`}
          alt={character.name}
          style={{
            ...characterSpriteStyle,
            transform: isAnimating 
              ? `scale(${animationConfig.scale})` 
              : 'scale(1)',
            transition: `transform ${animationConfig.duration}ms ease-in-out`
          }}
          onError={(e) => {
            console.error(`Failed to load sprite for ${character.sprite}`);
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#e0e0e0;color:#666;font-size:10px;">Missing</div>';
          }}
        />
        {isDeployed && (
          <div style={deployedIndicatorStyle}>
            ✓
          </div>
        )}
      </div>
      <div style={characterInfoStyle}>
        <div style={{
          ...characterNameStyle,
          color: isDeployed ? '#888' : '#000',
          fontWeight: isDeployed ? 'normal' : 'bold'
        }}>
          {character.name}
        </div>
      </div>
    </div>
  );
};

const characterCardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
    transition: 'background-color 0.2s ease'
  };

const characterSpriteContainerStyle = {
    width: '48px',
    height: '48px',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const
  };

const characterSpriteStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const
  };

const characterInfoStyle = {
    flex: 1
  };

const characterNameStyle = {
    fontSize: '14px',
    fontWeight: 'bold' as const
  };

const deployedIndicatorStyle = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold' as const
  };