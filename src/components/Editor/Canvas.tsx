import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TerrainType } from '../Core/gameCore/types/TerrainType';
import { createHexCoordinate, HexCoordinate } from '../Core/gameCore/types/HexCoordinate';
import { GridLayout } from '../Core/gameCore/system-config/GridLayout';
import { ScrollConfig } from '../Core/gameCore/system-config/ScrollConfig';
import BackgroundImageRenderer from './canvas-component/BackgroundImageRenderer';
import HexaCellRenderer from './canvas-component/HexaCellRenderer';

interface Props {
  width: number;
  height: number;
  terrain: TerrainType[][];
  selectedTerrain: TerrainType;
  onCellClick: (x: number, y: number) => void;
  backgroundImage: string | null;
  deployableCells?: { x: number; y: number; index: number }[];
}

const TERRAIN_COLORS: Record<TerrainType, string> = {
  plain: '#A9DFBF',
  mountain: '#D5DBDB',
  forest: '#82E0AA',
  sea: '#85C1E9',
  river: '#5DADE2',
  cliff: '#F5B7B1',
  road: '#F7DC6F',
  wasteland: '#F0B27A',
  ruins: '#D7BDE2',
  swamp: '#A3E4D7',
};

const Canvas: React.FC<Props> = ({ 
  width, 
  height, 
  terrain,
  selectedTerrain,
  onCellClick,
  backgroundImage,
  deployableCells = []
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastCellRef = useRef<{x: number, y: number} | null>(null);

  // Generate grid in the same way as MapRenderer
  const generateGrid = () => {
    const grid: HexCoordinate[][] = [];
    // Start from top-left and go right, then down
    for (let y = 0; y < height; y++) {
      const row: HexCoordinate[] = [];
      for (let x = 0; x < width; x++) {
        row.push(createHexCoordinate(x, y));
      }
      grid.push(row);
    }
    return grid;
  };

  const grid = generateGrid();

  // Calculate map dimensions exactly as in MapRenderer
  const mapWidth = width * GridLayout.WIDTH + GridLayout.ROW_OFFSET + (ScrollConfig.PADDING * 2);
  const mapHeight = height * GridLayout.WIDTH * 0.75 + (ScrollConfig.PADDING * 2);

  // Function to find the hex cell under the mouse position
  const findCellUnderMouse = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return null;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;
    
    // Calculate relative position within the canvas
    const x = clientX - rect.left + scrollLeft;
    const y = clientY - rect.top + scrollTop;
    
    // Find the cell that contains this point
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      const row = grid[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = row[colIndex];
        const cellElement = document.getElementById(`hex-${cell.x}-${cell.y}`);
        
        if (cellElement) {
          const cellRect = cellElement.getBoundingClientRect();
          const cellX = cellRect.left - rect.left + scrollLeft;
          const cellY = cellRect.top - rect.top + scrollTop;
          
          // Check if point is within this hex cell
          // This is a simplified check - for a more accurate check, we'd need to use the hexagon's clip path
          if (
            x >= cellX && 
            x <= cellX + GridLayout.WIDTH && 
            y >= cellY && 
            y <= cellY + GridLayout.WIDTH
          ) {
            // Return the cell coordinates as they are, since they're already in the correct format
            return { x: cell.x, y: cell.y };
          }
        }
      }
    }
    
    return null;
  }, [grid]);

  const handleMouseDown = useCallback((clientX: number, clientY: number) => {
    const cell = findCellUnderMouse(clientX, clientY);
    if (cell) {
      setIsMouseDown(true);
      lastCellRef.current = cell;
      onCellClick(cell.x, cell.y);
    }
  }, [onCellClick, findCellUnderMouse]);

  const handleMouseMove = useCallback((clientX: number, clientY: number) => {
    if (isMouseDown) {
      const cell = findCellUnderMouse(clientX, clientY);
      if (cell && (!lastCellRef.current || lastCellRef.current.x !== cell.x || lastCellRef.current.y !== cell.y)) {
        lastCellRef.current = cell;
        onCellClick(cell.x, cell.y);
      }
    }
  }, [isMouseDown, onCellClick, findCellUnderMouse]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    lastCellRef.current = null;
  }, []);

  // Add global mouse up event listener to ensure we catch mouse up events outside the canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false);
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMouseDown]);

  return (
    <div 
      ref={canvasRef}
      style={canvasStyle}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #ccc',
      }}>
        <div>Selected: {selectedTerrain}</div>
        <div>Size: {width} x {height}</div>
      </div>
      
      <div style={{
        flex: 1,
        overflow: 'auto',
        position: 'relative',
      }}>
        <div style={{
          width: `${mapWidth}px`,
          height: `${mapHeight}px`,
          position: 'relative',
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        }}>
          <BackgroundImageRenderer backgroundImage={backgroundImage} />
          <div style={getMapStyle(mapWidth, mapHeight)}>
            {grid.map((row, index) => (
              <div key={index} style={{
                display: 'flex',
                margin: 0,
                padding: 0,
                lineHeight: 0,
                fontSize: 0,
                whiteSpace: 'nowrap',
                marginLeft: (height - 1 - index) % 2 === 0 ? `${GridLayout.ROW_OFFSET}px` : '0',
                marginTop: index === 0 ? '0' : '-25px',
                transform: 'translateY(-12.5px)', // Adjust vertical alignment
              }}>
                {row.map((coordinate) => {
                  // Access terrain using the correct indices
                  // The terrain array is [y][x], so we need to access it as [y][x]
                  const terrainType = terrain[coordinate.y]?.[coordinate.x] || 'plain';
                  const deployableCell = deployableCells?.find(cell => cell.x === coordinate.x && cell.y === coordinate.y);
                  return (
                    <HexaCellRenderer
                      coordinate={coordinate}
                      terrainColor={TERRAIN_COLORS[terrainType]}
                      handleMouseDown={handleMouseDown}
                      handleMouseMove={handleMouseMove}
                      deployable={!!deployableCell}
                      deployableIndex={deployableCell?.index}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;

const canvasStyle = {
  height: '100%',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
} as const;

const getMapStyle = (mapWidth: number, mapHeight: number) => {
  return {
    position: 'absolute',
    top: ScrollConfig.PADDING,
    left: ScrollConfig.PADDING,
    width: mapWidth - (ScrollConfig.PADDING * 2),
    height: mapHeight - (ScrollConfig.PADDING * 2),
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  } as const;
}