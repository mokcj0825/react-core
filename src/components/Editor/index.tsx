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

  const handleTerrainSelect = useCallback((terrainType: TerrainType) => {
    console.log('Selected terrain:', terrainType);
    setSelectedTerrain(terrainType);
  }, []);

  const handleCellClick = useCallback((x: number, y: number) => {
    setTerrain(prevTerrain => {
      const newTerrain = [...prevTerrain];
      if (newTerrain[y] && newTerrain[y][x] !== undefined) {
        newTerrain[y] = [...newTerrain[y]];
        newTerrain[y][x] = selectedTerrain;
      }
      return newTerrain;
    });
  }, [selectedTerrain]);

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
    setTerrain(mapData.terrain);
    setBackgroundImage(mapData.backgroundImage);
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
        />
      </div>
    </div>
  );
};

export default Editor; 