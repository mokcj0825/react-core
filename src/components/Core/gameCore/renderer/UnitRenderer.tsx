import React, { useMemo, useEffect, useRef } from 'react';
import { DeploymentCharacter } from '../types/DeploymentCharacter';
import { GridLayout } from '../system-config/GridLayout';
import { ScrollConfig } from '../system-config/ScrollConfig';
import {Origin2D, Vector2D} from "../../../Editor/utils/Vector2D.ts";

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
  units: (DeploymentCharacter & { position: Vector2D })[];
  mapDimensions?: Vector2D;
}

/**
 * UnitRenderer component
 * Renders units on the battlefield based on their hex coordinates
 * Uses Cartesian coordinate system with (0,0) at bottom-left corner
 */
export const UnitRenderer: React.FC<UnitProps> = ({ 
  units,
  mapDimensions = Origin2D
}) => {
  // Use a ref to track if POST_DEPLOY has been announced
  const hasAnnouncedPostDeploy = useRef(false);
  
  // Announce POST_DEPLOY trigger once when units are first deployed
  useEffect(() => {
    if (units.length > 0 && !hasAnnouncedPostDeploy.current) {
      console.log('Trigger: POST_DEPLOY - Units have been deployed');
      
      // Dispatch a custom event that Stage.tsx can listen for
      const postDeployEvent = new CustomEvent('post-deploy-trigger', {
        detail: { units }
      });
      window.dispatchEvent(postDeployEvent);
      
      hasAnnouncedPostDeploy.current = true;
    }
  }, [units]);

  // Calculate the grid height once
  const unitPositions = useMemo(() => {
    // Calculate the grid height once
    const hexHeight = GridLayout.WIDTH * UNIT_RENDER_CONFIG.HEX_HEIGHT_RATIO;
      
    return units.map(unit => {
      const { x, y } = unit.position;
      
      // Calculate position within the Cartesian grid
      // For a Cartesian system with (0,0) at bottom-left
      const isOffsetRow = y % 2 === 0;
      const rowOffset = isOffsetRow ? GridLayout.ROW_OFFSET : 0;
      
      // Calculate final position
      const unitX = (x * GridLayout.WIDTH) + rowOffset + ScrollConfig.PADDING;
      // For bottom positioning, we directly use y coordinate
      const unitY = y * hexHeight + ScrollConfig.PADDING;
      
      return {
        unit,
        position: { x: unitX, y: unitY }
      };
    });
  }, [units]);

  return (
    <div className="unit-layer" style={unitLayerStyle}>
      {unitPositions.map(({ unit, position }) => (
        <div
          key={`unit-${unit.id}-${unit.position.x}-${unit.position.y}`}
          style={{
            ...unitContainerStyle,
            left: `${position.x}px`,
            bottom: `${position.y}px`,
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
      ))}
    </div>
  );
};

// Styles
const unitLayerStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none' as const,
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