import React, { useState, useEffect, useCallback } from 'react';
import { TerrainType } from '../types/TerrainType';
import { createHexCoordinate, HexCoordinate } from '../types/HexCoordinate';
import { GridLayout } from '../system-config/GridLayout';
import { ScrollConfig } from '../system-config/ScrollConfig';
import { GridRenderer } from './GridRenderer';
import { Position } from './map-utils';
import { HighlightType } from '../types/HighlightType';
import { BackgroundRenderer } from './BackgroundRenderer';

// Character data interface
interface Character {
  id: number;
  name: string;
  sprite: string;
}

// Static character list
const PLAYABLE_CHARACTERS: Character[] = [
  { id: 1, name: '测试单位1', sprite: 'archer' },
  { id: 2, name: '测试单位2', sprite: 'healer' },
  { id: 3, name: '测试单位3', sprite: 'mage' },
  { id: 4, name: '测试单位4', sprite: 'rogue' },
  { id: 5, name: '测试单位5', sprite: 'warrior' }
];

// Character sprite configuration
const CHARACTER_SPRITE_CONFIG = {
  size: 48,
  animation: {
    duration: 2000,
    scale: 1.1
  }
};

interface MapData {
  width: number;
  height: number;
  terrain: TerrainType[][];
  background?: string;
  deployableCells?: { x: number; y: number; index: number }[];
}

interface Props {
  readonly stageId: string;
}

export const DeploymentRenderer: React.FC<Props> = ({ stageId }) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [spriteAnimations, setSpriteAnimations] = useState<Record<number, boolean>>({});

  // Load map data when stageId changes
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const map = await import(`../map-data/map-${stageId}.json`);
        console.log(`Loaded map data for ${stageId}:`, map);
        setMapData(map);
        
        // Load background if specified
        if (map.background) {
          console.log(`Map ${stageId} has background: ${map.background}`);
          await BackgroundRenderer.loadBackground(stageId, map.background);
          setBackgroundLoaded(true);
          console.log(`Background loaded for map ${stageId}`);
        }
      } catch (error) {
        console.error('Failed to load map data:', error);
      }
    };

    loadMapData();
  }, [stageId]);

  // Memoized character selection handler
  const handleCharacterClick = useCallback((characterId: number) => {
    setSelectedCharacter(characterId);
    
    // Trigger animation for the clicked character
    setSpriteAnimations(prev => ({
      ...prev,
      [characterId]: true
    }));
    
    // Reset animation after duration
    setTimeout(() => {
      setSpriteAnimations(prev => ({
        ...prev,
        [characterId]: false
      }));
    }, CHARACTER_SPRITE_CONFIG.animation.duration);
  }, []);

  // Memoized cell click handler
  //const handleCellClick = useCallback((x: number, y: number) => {
  //  console.log('Clicked deployable cell:', x, y);
  //}, []);

  if (!mapData) {
    return <div>Loading map...</div>;
  }

  const { width, height, terrain, deployableCells = [] } = mapData;
  const grid = generateGrid(width, height);
  const mapWidth = width * GridLayout.WIDTH + GridLayout.ROW_OFFSET + (ScrollConfig.PADDING * 2);
  const mapHeight = height * GridLayout.WIDTH * 0.75 + (ScrollConfig.PADDING * 2);

  return (
    <div style={wrapperStyle}>
      <div style={characterPanelStyle}>
        <h3 style={panelTitleStyle}>战前部署阶段</h3>
        <div style={characterListStyle}>
          {PLAYABLE_CHARACTERS.map(character => (
            <div
              key={character.id}
              onClick={() => handleCharacterClick(character.id)}
              style={{
                ...characterCardStyle,
                backgroundColor: selectedCharacter === character.id ? '#E8F5E9' : '#fff'
              }}
            >
              <div style={characterSpriteContainerStyle}>
                <img 
                src={`/sprites/${character.sprite}.svg`}
                  alt={character.name}
                  style={{
                    ...characterSpriteStyle,
                    transform: spriteAnimations[character.id] 
                      ? `scale(${CHARACTER_SPRITE_CONFIG.animation.scale})` 
                      : 'scale(1)',
                    transition: `transform ${CHARACTER_SPRITE_CONFIG.animation.duration}ms ease-in-out`
                  }}
                  onError={(e) => {
                    console.error(`Failed to load sprite for ${character.sprite}`);
                    // Set a fallback image or show a placeholder
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#e0e0e0;color:#666;font-size:10px;">Missing</div>';
                  }}
                />
              </div>
              <div style={characterInfoStyle}>
                <div style={characterNameStyle}>{character.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={mapContainerStyle}>
        {backgroundLoaded && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${mapWidth}px`,
              height: `${mapHeight}px`,
              zIndex: 0,
              ...BackgroundRenderer.getBackgroundStyle(stageId, position)
            }}
          />
        )}
        <div 
          style={{
            ...mapSheetStyle(mapWidth, mapHeight, position),
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
        >
          {grid.map((row, index) => (
            <div key={index} style={gridStyle(height, index)}>
              {row.map((coordinate) => {
                const deployableCell = deployableCells.find(
                  cell => cell.x === coordinate.x && cell.y === coordinate.y
                );
                return (
                  <GridRenderer
                    key={`${coordinate.x},${coordinate.y}`}
                    coordinate={coordinate}
                    terrain={terrain[coordinate.y][coordinate.x]}
                    highlight={deployableCell ? 'deployable' as HighlightType : undefined}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pure function to generate grid - no side effects
const generateGrid = (width: number, height: number): HexCoordinate[][] => {
  const grid: HexCoordinate[][] = [];
  for (let y = height - 1; y >= 0; y--) {
    const row: HexCoordinate[] = [];
    for (let x = 0; x < width; x++) {
      row.push(createHexCoordinate(x, y));
    }
    grid.push(row);
  }
  return grid;
};

// Styles defined outside component to avoid recreation on each render
const wrapperStyle = {
  display: 'flex',
  height: '100%',
  width: '100%',
  position: 'relative' as const
};

const characterPanelStyle = {
  width: '250px',
  borderRight: '1px solid #ccc',
  padding: '16px',
  backgroundColor: '#f5f5f5',
  overflow: 'auto' as const
};

const panelTitleStyle = {
  margin: '0 0 16px 0',
  fontSize: '18px',
  fontWeight: 'bold' as const
};

const characterListStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px'
};

const characterCardStyle = {
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'all 0.2s'
};

const characterSpriteContainerStyle = {
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '12px',
  overflow: 'hidden'
};

const characterSpriteStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain' as const
};

const characterInfoStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  flex: 1
};

const characterNameStyle = {
  fontWeight: 'bold' as const
};

const mapContainerStyle = {
  flex: 1,
  overflow: 'auto' as const,
  position: 'relative' as const
};

const mapSheetStyle = (mapWidth: number, mapHeight: number, position: Position) => ({
  padding: `${ScrollConfig.PADDING}px`,
  width: `${mapWidth}px`,
  height: `${mapHeight}px`,
  margin: 0,
  boxSizing: 'border-box' as const,
  position: 'absolute' as const,
  zIndex: 1,
  transform: `translate(${position.x}px, ${position.y}px)`,
  transition: 'transform 0.1s linear'
});

const gridStyle = (height: number, index: number) => ({
  display: 'flex',
  margin: 0,
  padding: 0,
  lineHeight: 0,
  fontSize: 0,
  whiteSpace: 'nowrap' as const,
  marginLeft: (height - 1 - index) % 2 === 0 ? `${GridLayout.ROW_OFFSET}px` : '0',
  marginTop: index === 0 ? '0' : '-25px'
});
