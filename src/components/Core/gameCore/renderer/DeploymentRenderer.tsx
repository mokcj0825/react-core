import React, { useState, useEffect, useCallback } from 'react';
import { TerrainType } from '../types/TerrainType';
import { createHexCoordinate, HexCoordinate } from '../types/HexCoordinate';
import { GridLayout } from '../system-config/GridLayout';
import { ScrollConfig } from '../system-config/ScrollConfig';
import { GridRenderer } from "./deployment/GridRenderer.tsx";
import { Position } from './map-utils';
import { HighlightType } from '../types/HighlightType';
import { BackgroundRenderer } from './BackgroundRenderer';
import { CharacterRenderer } from './CharacterRenderer';
import { DeploymentCharacter } from '../types/DeploymentCharacter';
import { useNavigate } from 'react-router-dom';

// Character data interface

// Static character list
const PLAYABLE_CHARACTERS: DeploymentCharacter[] = [
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
  // @ts-ignore
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [spriteAnimations, setSpriteAnimations] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

// Add these state variables to DeploymentRenderer
const [draggedCharacter, setDraggedCharacter] = useState<DeploymentCharacter | null>(null);
const [deployedUnits, setDeployedUnits] = useState<Record<string, DeploymentCharacter>>({});

  // Load map data when stageId changes
  useEffect(() => {
    const loadMapData = async () => {
      try {
        // Load map data from public directory instead of importing
        const response = await fetch(`/map-data/${stageId}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch map data for ${stageId}: ${response.statusText}`);
        }
        
        const map = await response.json();
        console.log(`Loaded map data for ${stageId}:`, map);
        setMapData(map);

        if (map.background) {
          await BackgroundRenderer.loadBackground(stageId, map.background);
          setBackgroundLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load map data:', error);
      }
    };

    loadMapData();
  }, [stageId]);

  // Add these handlers to DeploymentRenderer
  const handleDragStart = (character: DeploymentCharacter) => {
    if (!Object.values(deployedUnits).some(unit => unit.id === character.id)) {
      setDraggedCharacter(character);
    }
  };

  // @ts-ignore
  const handleDragOver = (e: React.DragEvent, coordinate: HexCoordinate) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, coordinate: HexCoordinate) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedCharacter) return;
    
    const cellKey = `${coordinate.x},${coordinate.y}`;
    setDeployedUnits(prev => ({
      ...prev,
      [cellKey]: draggedCharacter
    }));
    setDraggedCharacter(null);
  };

  const handleDragEnd = () => {
    setDraggedCharacter(null);
  };

  // @ts-ignore
  const handleRightClick = (coordinate: HexCoordinate, unit: DeploymentCharacter) => {
    const cellKey = `${coordinate.x},${coordinate.y}`;

    setDeployedUnits(prev => {
      const newDeployedUnits = { ...prev };
      delete newDeployedUnits[cellKey];
      return newDeployedUnits;
    });
  };

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

  const handleStartBattle = useCallback(() => {
    // Create deployment data object
    const deploymentData = {
      stageId,
      deployableCells: mapData?.deployableCells?.map(cell => ({
        x: cell.x,
        y: cell.y,
        index: cell.index
      })) || [],
      deployedUnits: Object.entries(deployedUnits).map(([key, unit]) => {
        const [x, y] = key.split(',').map(Number);
        return {
          ...unit,
          position: { x, y }
        };
      })
    };

    localStorage.setItem(`deployment_${stageId}`, JSON.stringify(deploymentData));

    navigate(`/core/battlefield/${stageId}`);
  }, [stageId, deployedUnits, navigate, mapData]);

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
            <CharacterRenderer
              key={character.id}
              character={character}
              isSelected={selectedCharacter === character.id}
              isAnimating={!!spriteAnimations[character.id]}
              onClick={handleCharacterClick}
              animationConfig={CHARACTER_SPRITE_CONFIG.animation}
              onDragStart={() => handleDragStart(character)}
              onDragEnd={handleDragEnd}
              isDeployed={Object.values(deployedUnits).some(unit => unit.id === character.id)}
            />
          ))}
          <button 
            onClick={handleStartBattle}
            style={startButtonStyle}
          >
            开始战斗
          </button>
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
                const cellKey = `${coordinate.x},${coordinate.y}`;
                const deployedUnit = deployedUnits[cellKey];
                
                return (
                  <GridRenderer
                    key={cellKey}
                    coordinate={coordinate}
                    terrain={terrain[coordinate.y][coordinate.x]}
                    highlight={deployableCell ? 'deployable' as HighlightType : undefined}
                    onDragOver={(e) => handleDragOver(e, coordinate)}
                    onDrop={(e) => handleDrop(e, coordinate)}
                    deployedUnit={deployedUnit}
                    onRightClick={handleRightClick}
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

const startButtonStyle = {
  marginTop: '16px',
  padding: '8px 16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  width: '100%',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#45a049'
  }
};
