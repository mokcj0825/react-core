import React from 'react';
import { DeploymentCharacter } from '../types/DeploymentCharacter';

interface Props {
  character: {
    id: number;
    name: string;
    sprite: string;
  };
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

  return (
    <div
      onClick={() => onClick(character.id)}
      draggable={!isDeployed}
      onDragStart={() => onDragStart?.(character)}
      onDragEnd={() => onDragEnd?.()}
      style={{
        ...characterCardStyle,
        backgroundColor: isSelected ? '#E8F5E9' : '#fff'
      }}
    >
      <div style={characterSpriteContainerStyle}>
        <img 
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
      </div>
      <div style={characterInfoStyle}>
        <div style={characterNameStyle}>{character.name}</div>
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
    overflow: 'hidden'
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
    fontWeight: 'bold',
    fontSize: '14px'
  };