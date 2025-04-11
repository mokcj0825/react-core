import React, { useState, useEffect } from 'react';
import { TerrainType } from '../Core/gameCore/types/TerrainType';
import Palette from './Palette';
import Canvas from './Canvas';

interface EditorState {
  width: number;
  height: number;
  terrain: TerrainType[][];
  selectedTerrain: TerrainType;
  backgroundImage: string | null;
}

const Editor: React.FC = () => {
  const [editorState, setEditorState] = React.useState<EditorState>({
    width: 10,
    height: 10,
    terrain: Array(10).fill(null).map(() => Array(10).fill('plain')),
    selectedTerrain: 'plain',
    backgroundImage: null,
  });

  const handleTerrainSelect = (terrain: TerrainType) => {
    console.log('Selecting terrain:', terrain);
    setEditorState(prev => ({
      ...prev,
      selectedTerrain: terrain,
      // Keep the existing terrain array unchanged
      terrain: prev.terrain
    }));
  };

  const handleCellClick = (x: number, y: number) => {
    setEditorState(prev => {
      const newTerrain = [...prev.terrain];
      if (newTerrain[y] && newTerrain[y][x] !== undefined) {
        newTerrain[y][x] = prev.selectedTerrain;
      }
      return {
        ...prev,
        terrain: newTerrain,
      };
    });
  };

  const handleWidthChange = (newWidth: number) => {
    setEditorState(prev => {
      // Create a new terrain array with the new width
      const newTerrain = Array(prev.height).fill(null).map((_, y) => {
        const row = Array(newWidth).fill('plain');
        // Copy existing terrain data if available
        if (prev.terrain[y]) {
          for (let x = 0; x < Math.min(prev.width, newWidth); x++) {
            row[x] = prev.terrain[y][x];
          }
        }
        return row;
      });
      
      return {
        ...prev,
        width: newWidth,
        terrain: newTerrain,
      };
    });
  };

  const handleHeightChange = (newHeight: number) => {
    setEditorState(prev => {
      // Create a new terrain array with the new height
      const newTerrain = Array(newHeight).fill(null).map((_, y) => {
        // If we have existing terrain for this row, use it
        if (y < prev.height) {
          return [...prev.terrain[y]];
        }
        // Otherwise create a new row of plains
        return Array(prev.width).fill('plain');
      });
      
      return {
        ...prev,
        height: newHeight,
        terrain: newTerrain,
      };
    });
  };

  const handleBackgroundImageChange = (imagePath: string) => {
    setEditorState(prev => ({
      ...prev,
      backgroundImage: imagePath,
    }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      width: '100%',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div style={{ 
        width: '300px', 
        borderRight: '1px solid #ccc',
        overflow: 'hidden'
      }}>
        <Palette 
          selectedTerrain={editorState.selectedTerrain}
          onTerrainSelect={handleTerrainSelect}
          width={editorState.width}
          height={editorState.height}
          onWidthChange={handleWidthChange}
          onHeightChange={handleHeightChange}
          backgroundImage={editorState.backgroundImage}
          onBackgroundImageChange={handleBackgroundImageChange}
        />
      </div>
      <div style={{ 
        flex: 1, 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Canvas 
          width={editorState.width}
          height={editorState.height}
          terrain={editorState.terrain}
          selectedTerrain={editorState.selectedTerrain}
          onCellClick={handleCellClick}
          backgroundImage={editorState.backgroundImage}
        />
      </div>
    </div>
  );
};

export default Editor; 