import React, { useState, useCallback } from 'react';
import { TerrainType } from '../Core/gameCore/types/TerrainType';
import Palette, { MapData } from './Palette';
import Canvas from './Canvas';

const Editor: React.FC = () => {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [terrain, setTerrain] = useState<TerrainType[][]>(() => {
    // Initialize with plain terrain
    const initialTerrain: TerrainType[][] = [];
    for (let y = 0; y < height; y++) {
      const row: TerrainType[] = [];
      for (let x = 0; x < width; x++) {
        row.push('plain');
      }
      initialTerrain.push(row);
    }
    return initialTerrain;
  });
  const [selectedTerrain, setSelectedTerrain] = useState<TerrainType>('plain');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [deployableCells, setDeployableCells] = useState<{x: number, y: number, index: number}[]>([
  ]);
  const [isDeployMode, setIsDeployMode] = useState(false);

  const handleTerrainSelect = useCallback((terrainType: TerrainType) => {
    console.log('Selected terrain:', terrainType);
    setSelectedTerrain(terrainType);
    setIsDeployMode(false);
  }, []);

  const toggleDeployMode = useCallback(() => {
    setIsDeployMode(prev => !prev);
  }, []);

  const handleCellClick = useCallback((x: number, y: number) => {
    if (isDeployMode) {
      // For deployable cells, we need to use the coordinate system where [0][0] is at bottom-left
      // The grid is rendered from top-left to bottom-right, so we need to flip the y-coordinate
      const coordY = (height - 1) - y;
      
      setDeployableCells(prevCells => {
        // Find existing cell using the bottom-left coordinate system
        const existingCell = prevCells.find(cell => 
          cell.x === x && cell.y === coordY
        );
        
        if (existingCell) {
          return prevCells.filter(cell => 
            !(cell.x === x && cell.y === coordY)
          );
        } else {
          const nextIndex = prevCells.length > 0 
            ? Math.max(...prevCells.map(cell => cell.index)) + 1 
            : 1;
          // Store the cell using the bottom-left coordinate system
          return [...prevCells, { x, y: coordY, index: nextIndex }];
        }
      });
    } else {
      // For terrain, we use the array position directly
      setTerrain(prevTerrain => {
        const newTerrain = [...prevTerrain];
        if (newTerrain[y] && newTerrain[y][x] !== undefined) {
          newTerrain[y] = [...newTerrain[y]];
          newTerrain[y][x] = selectedTerrain;
        }
        return newTerrain;
      });
    }
  }, [selectedTerrain, isDeployMode, height]);

  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth);
    // Resize terrain array
    setTerrain(prevTerrain => {
      const newTerrain: TerrainType[][] = [];
      for (let y = 0; y < height; y++) {
        const row: TerrainType[] = [];
        for (let x = 0; x < newWidth; x++) {
          // Keep existing terrain if available, otherwise use plain
          row.push(prevTerrain[y]?.[x] || 'plain');
        }
        newTerrain.push(row);
      }
      return newTerrain;
    });
  }, [height]);

  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight);
    // Resize terrain array
    setTerrain(prevTerrain => {
      const newTerrain: TerrainType[][] = [];
      for (let y = 0; y < newHeight; y++) {
        const row: TerrainType[] = [];
        for (let x = 0; x < width; x++) {
          // Keep existing terrain if available, otherwise use plain
          row.push(prevTerrain[y]?.[x] || 'plain');
        }
        newTerrain.push(row);
      }
      return newTerrain;
    });
  }, [width]);

  const handleLoadMap = useCallback((mapData: MapData) => {
    // Update all state with the loaded map data
    setWidth(mapData.width);
    setHeight(mapData.height);
    
    // The terrain array from the loaded map is already in the correct format
    // where [0][0] is at the bottom-left, so we can use it directly
    setTerrain(mapData.terrain);
    
    // Only set background image if it exists in the loaded data
    if (mapData.backgroundImage) {
      setBackgroundImage(mapData.backgroundImage);
    }
    
    // Set deployable cells if they exist in the loaded data
    if (mapData.deployableCells) {
      setDeployableCells(mapData.deployableCells);
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      overflow: 'hidden',
    }}>
      <div style={{ 
        width: '300px', 
        borderRight: '1px solid #ccc',
        overflow: 'hidden',
      }}>
        <Palette 
          selectedTerrain={selectedTerrain}
          onTerrainSelect={handleTerrainSelect}
          width={width}
          height={height}
          onWidthChange={handleWidthChange}
          onHeightChange={handleHeightChange}
          backgroundImage={backgroundImage}
          onBackgroundImageChange={setBackgroundImage}
          terrain={terrain}
          onLoadMap={handleLoadMap}
          isDeployMode={isDeployMode}
          onToggleDeployMode={toggleDeployMode}
          deployableCells={deployableCells}
        />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Canvas 
          width={width}
          height={height}
          terrain={terrain}
          selectedTerrain={selectedTerrain}
          onCellClick={handleCellClick}
          backgroundImage={backgroundImage}
          deployableCells={deployableCells}
        />
      </div>
    </div>
  );
};

export default Editor; 