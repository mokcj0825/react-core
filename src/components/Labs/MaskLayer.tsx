import React from 'react';

type Unit = 'px' | '%';
type PositionValue = `${number}${Unit}`;

interface Position {
  x: PositionValue;
  y: PositionValue;
  size: PositionValue;
  anchor: 'ANCHOR_MIDDLE' | 'ANCHOR_TOP_LEFT' | 'ANCHOR_TOP_RIGHT' | 'ANCHOR_BOTTOM_LEFT' | 'ANCHOR_BOTTOM_RIGHT';
}


interface MaskLayerProps {
  holePosition: Position;
  backgroundColor?: string;
  onOverlayClick?: () => void;
  maskIndex?: number;
}

const MaskLayer: React.FC<MaskLayerProps> = ({ 
  holePosition,
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
  onOverlayClick,
  maskIndex = 1000,
}) => {
  const handleClick = () => {
    if (onOverlayClick) {
      onOverlayClick();
    }
  };

  const getHoleBoundaries = () => {
    const size = parseInt(holePosition.size);
    const x = holePosition.x;
    const y = holePosition.y;
    
    // Helper function to parse value and unit
    const parseValue = (value: PositionValue) => {
      const match = value.match(/^(\d+(?:\.\d+)?)(px|%)$/);
      if (!match) {
        throw new Error(`Invalid position value: ${value}. Expected format: "numberpx" or "number%"`);
      }
      return {
        value: parseFloat(match[1]),
        unit: match[2] as Unit
      };
    };
    
    const sizeParsed = parseValue(holePosition.size);
    const xParsed = parseValue(holePosition.x);
    const yParsed = parseValue(holePosition.y);
    
    switch (holePosition.anchor) {
      case 'ANCHOR_TOP_LEFT':
        return {
          left: x,
          top: y,
          right: `calc(${x} + ${holePosition.size})`,
          bottom: `calc(${y} + ${holePosition.size})`
        };
      case 'ANCHOR_TOP_RIGHT':
        return {
          left: `calc(${x} - ${holePosition.size})`,
          top: y,
          right: x,
          bottom: `calc(${y} + ${holePosition.size})`
        };
      case 'ANCHOR_BOTTOM_LEFT':
        return {
          left: x,
          top: `calc(${y} - ${holePosition.size})`,
          right: `calc(${x} + ${holePosition.size})`,
          bottom: y
        };
      case 'ANCHOR_BOTTOM_RIGHT':
        return {
          left: `calc(${x} - ${holePosition.size})`,
          top: `calc(${y} - ${holePosition.size})`,
          right: x,
          bottom: y
        };
      case 'ANCHOR_MIDDLE':
      default:
        return {
          left: `calc(${x} - ${sizeParsed.value / 2}${sizeParsed.unit})`,
          top: `calc(${y} - ${sizeParsed.value / 2}${sizeParsed.unit})`,
          right: `calc(${x} + ${sizeParsed.value / 2}${sizeParsed.unit})`,
          bottom: `calc(${y} + ${sizeParsed.value / 2}${sizeParsed.unit})`
        };
    }
  };

  const holeBounds = getHoleBoundaries();

  return (
  <>
    <div 
        onClick={handleClick}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: holeBounds.top,
          backgroundColor: backgroundColor,
          zIndex: maskIndex
        }}
      />
    
      <div 
        onClick={handleClick}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `calc(100% - ${holeBounds.bottom})`,
          backgroundColor: backgroundColor,
          zIndex: maskIndex
        }}
      />
      
      <div 
        onClick={handleClick}
        style={{
          position: 'absolute',
          top: holeBounds.top,
          left: 0,
          width: holeBounds.left,
          height: holePosition.size,
          backgroundColor: backgroundColor,
          zIndex: maskIndex
        }}
      />

      <div 
        onClick={handleClick}
        style={{
          position: 'absolute',
          top: holeBounds.top,
          right: 0,
          width: `calc(100% - ${holeBounds.right})`,
          height: holePosition.size,
          backgroundColor: backgroundColor,
          zIndex: maskIndex
        }}
      />
      </>
  );
};

export default MaskLayer; 