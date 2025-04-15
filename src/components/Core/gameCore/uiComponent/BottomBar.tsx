import React, { useState, useEffect } from 'react';
import { HexCoordinate } from '../types/HexCoordinate';
import { TerrainType } from '../types/TerrainType';
import {eventBus, UIEventType} from "../events/EventBus.ts";


/**
 * BottomBar component that displays terrain and coordinate information when a cell is hovered.
 * It uses an event-driven architecture to receive updates from other components.
 *
 * @returns {JSX.Element} The rendered bottom bar component
 */
const BottomBar: React.FC = () => {
  // State for the component
  const [coordinate, setCoordinate] = useState<HexCoordinate | null>(null);
  const [terrain, setTerrain] = useState<TerrainType | null>(null);
  const [isOutsideGrid, setIsOutsideGrid] = useState(true);

  // Subscribe to events when the component mounts
  useEffect(() => {
    
    const unsubscribeHover = eventBus.subscribe(UIEventType.CELL_HOVER, (event) => {
      if (event.payload?.coordinate && event.payload?.terrain) {
        setCoordinate(event.payload.coordinate);
        setTerrain(event.payload.terrain);
        setIsOutsideGrid(false);
      }
    });

    const unsubscribeLeave = eventBus.subscribe(UIEventType.CELL_LEAVE, () => {
      setIsOutsideGrid(true);
    });

    return () => {
      unsubscribeHover();
      unsubscribeLeave();
    };
  }, []);

  // Format the coordinate and terrain information
  const formatInfo = (): string => {
    if (isOutsideGrid) {
      return '坐标：N/A 地形：N/A';
    }
    
    if (!coordinate || !terrain) {
      return '坐标：N/A 地形：N/A';
    }
    
    return `坐标：(${coordinate.x}, ${coordinate.y}) 地形：${terrain}`;
  };

  return (
    <div style={bottomBarStyle}>
      {formatInfo()}
    </div>
  );
};

export default BottomBar;

const bottomBarStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  height: `40px`,
  backgroundColor: `rgba(0, 0, 0, 0.7)`,
  color: `#FFFFFF`,
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  pointerEvents: 'none',
};