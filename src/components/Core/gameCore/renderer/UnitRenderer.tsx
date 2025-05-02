import React from 'react';
import { DeploymentCharacter } from '../types/DeploymentCharacter';
import { createHexCoordinate } from '../types/HexCoordinate';
import { GridLayout } from '../system-config/GridLayout';
import { ScrollConfig } from '../system-config/ScrollConfig';

// Constants for unit rendering configuration
const UNIT_RENDER_CONFIG = {
  SPRITE_PATH: '/sprites/',
  SPRITE_EXTENSION: '.svg',
  Z_INDEX: 5,
  HEX_HEIGHT_RATIO: 0.75,
  SPRITE_WIDTH: '60%',
};

// Unit data interface matching deployment data structure
interface UnitProps {
  units: (DeploymentCharacter & { position: { x: number; y: number } })[];
  mapPosition?: { x: number, y: number }; // Position of map for transform sync
  mapDimensions?: { width: number, height: number }; // Map dimensions
}

/**
 * UnitRenderer component
 * 
 * Renders units on the battlefield based on their hex coordinates
 * Units stick to the grid positions, not to the screen
 */
export const UnitRenderer: React.FC<UnitProps> = ({ 
  units,
  mapPosition = { x: 0, y: 0 },
  mapDimensions = { width: 0, height: 0 }
}) => {
  console.log('Rendering units with map position:', mapPosition);

  // Use the same transform style as the MapRenderer's mapSheetStyle
  const unitLayerTransform = {
    transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)`,
    transition: 'transform 0.1s linear',
  };

  return (
    <div 
      className="unit-layer"
      style={{
        ...unitLayerStyle,
        ...unitLayerTransform,
        width: mapDimensions.width || '100%',
        height: mapDimensions.height || '100%',
        padding: `${ScrollConfig.PADDING}px`,
      }}
    >
      {units.map((unit) => {
        const { x, y } = unit.position;
        const hexCoord = createHexCoordinate(x, y);
        
        // Calculate position within hex grid - same calculation as used in MapRenderer
        const hexHeight = GridLayout.WIDTH * UNIT_RENDER_CONFIG.HEX_HEIGHT_RATIO;
        const isEvenRow = y % 2 === 0;
        const rowOffset = isEvenRow ? 0 : GridLayout.ROW_OFFSET;
        const unitX = (x * GridLayout.WIDTH) + rowOffset;
        const unitY = y * hexHeight;
        
        console.log(`Unit ${unit.id} at grid (${x},${y}), pixel: (${unitX},${unitY})`);
        
        return (
          <div
            key={`unit-${unit.id}-${x}-${y}`}
            style={{
              ...unitContainerStyle,
              left: `${unitX}px`,
              top: `${unitY}px`,
            }}
          >
            <img
              src={`${UNIT_RENDER_CONFIG.SPRITE_PATH}${unit.sprite}${UNIT_RENDER_CONFIG.SPRITE_EXTENSION}`}
              alt={unit.name}
              style={unitSpriteStyle}
              onError={(e) => {
                console.error(`Failed to load sprite for ${unit.sprite}`);
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:rgba(224,224,224,0.7);color:#666;font-size:10px;">Missing</div>';
              }}
            />
            <div style={unitNameStyle}>
              {unit.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Styles
const unitLayerStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  pointerEvents: 'none' as const,
  boxSizing: 'border-box' as const,
  margin: 0,
  zIndex: UNIT_RENDER_CONFIG.Z_INDEX,
};

const unitContainerStyle = {
  position: 'absolute' as const,
  width: GridLayout.WIDTH,
  height: GridLayout.WIDTH * UNIT_RENDER_CONFIG.HEX_HEIGHT_RATIO,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  pointerEvents: 'none' as const,
};

const unitSpriteStyle = {
  width: UNIT_RENDER_CONFIG.SPRITE_WIDTH,
  height: 'auto',
  objectFit: 'contain' as const,
};

const unitNameStyle = {
  fontSize: '10px',
  fontWeight: 'bold' as const,
  color: '#fff',
  textShadow: '0 0 2px #000',
  marginTop: '2px',
  textAlign: 'center' as const,
  width: '100%',
};

export default UnitRenderer; 