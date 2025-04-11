import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TerrainType } from '../Core/gameCore/types/TerrainType';
import { createHexCoordinate, HexCoordinate } from '../Core/gameCore/types/HexCoordinate';
import { GridLayout } from '../Core/gameCore/system-config/GridLayout';
import { ScrollConfig } from '../Core/gameCore/system-config/ScrollConfig';

interface CanvasProps {
  width: number;
  height: number;
  terrain: TerrainType[][];
  selectedTerrain: TerrainType;
  onCellClick: (x: number, y: number) => void;
  backgroundImage: string | null;
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

const Canvas: React.FC<CanvasProps> = ({ 
  width, 
  height, 
  terrain,
  selectedTerrain,
  onCellClick,
  backgroundImage
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastCellRef = useRef<{x: number, y: number} | null>(null);

  // Generate grid in the same way as MapRenderer
  const generateGrid = () => {
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
      style={{ 
        height: '100%', 
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #ccc',
      }}>
        <h2>Canvas</h2>
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
          {backgroundImage && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
          <div style={{
            position: 'absolute',
            top: ScrollConfig.PADDING,
            left: ScrollConfig.PADDING,
            width: mapWidth - (ScrollConfig.PADDING * 2),
            height: mapHeight - (ScrollConfig.PADDING * 2),
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
          }}>
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
                  const terrainType = terrain[coordinate.y]?.[coordinate.x] || 'plain';
                  return (
                    <div
                      id={`hex-${coordinate.x}-${coordinate.y}`}
                      key={`${coordinate.x},${coordinate.y}`}
                      onMouseDown={(e) => handleMouseDown(e.clientX, e.clientY)}
                      onMouseMove={(e) => handleMouseMove(e.clientX, e.clientY)}
                      style={{
                        width: `${GridLayout.WIDTH}px`,
                        height: `${GridLayout.WIDTH}px`,
                        clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontSize: '12px',
                        margin: 0,
                        padding: 0,
                        boxSizing: 'border-box',
                        flexShrink: 0,
                        flexGrow: 0,
                        position: 'relative',
                        backgroundColor: TERRAIN_COLORS[terrainType],
                        zIndex: 1,
                        opacity: 0.5,
                      }}
                    >
                      {/* Border for better visibility */}
                      <svg
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                          zIndex: 2,
                        }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 25 L0 75 L50 100 L100 75 L100 25 L50 0 Z"
                          fill="none"
                          stroke="#8B4513"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>

                      {/* Coordinate display */}
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '2px',
                        fontSize: '10px',
                        color: 'rgba(0, 0, 0, 0.7)',
                        zIndex: 3,
                      }}>
                        {coordinate.x},{coordinate.y}
                      </div>
                    </div>
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