import React from 'react';
import { TerrainType } from '../Core/gameCore/types/TerrainType';
import EditorAccordion from './palette-component/EditorAccordion';
import MapEditor from './palette-component/MapEditor';
import BackgroundEditor from './palette-component/BackgroundEditor';
import ImportEditor from './palette-component/ImportEditor';
import TerrainEditor from './palette-component/TerrainEditor';
import { Vector2D } from './utils/Vector2D';

interface PaletteProps {
  selectedTerrain: TerrainType;
  onTerrainSelect: (terrain: TerrainType) => void;
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  backgroundImage: string | null;
  onBackgroundImageChange: (imagePath: string) => void;
  terrain: TerrainType[][];
  onLoadMap: (mapData: MapData) => void;
}

// Define the map data structure for saving/loading
export interface MapData {
  width: number;
  height: number;
  terrain: TerrainType[][];
  backgroundImage: string | null | undefined;
}

const Palette: React.FC<PaletteProps> = ({ 
  selectedTerrain, 
  onTerrainSelect,
  width,
  height,
  onWidthChange,
  onHeightChange,
  backgroundImage,
  onBackgroundImageChange,
  terrain,
  onLoadMap
}) => {
  const handleSaveMap = () => {
    const mapData: MapData = {
      width,
      height,
      terrain: terrain.slice().reverse(),
      backgroundImage: undefined
    };
    
    // Convert to JSON string with proper formatting
    const mapDataString = JSON.stringify(mapData, null, 2);
    
    // Create a blob with proper MIME type
    const blob = new Blob([mapDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create and trigger download with timestamp in filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const a = document.createElement('a');
    a.href = url;
    a.download = `map-data-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up resources
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={wrapperStyle}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff',
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Map Editor</h2>
      </div>
      
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
      }}>
        {/* Map Size Editor */}
        <EditorAccordion title="Map Size">
          <MapEditor 
            dimensions={{ x: width, y: height }}
            onDimensionsChange={(newDimensions: Vector2D) => {
              onWidthChange(newDimensions.x);
              onHeightChange(newDimensions.y);
            }}
          />
        </EditorAccordion>

        {/* Background Image Editor */}
        <EditorAccordion title="Background Image">
          <BackgroundEditor 
            backgroundImage={backgroundImage}
            onBackgroundImageChange={onBackgroundImageChange}
          />
        </EditorAccordion>

        {/* Map Actions */}
        <EditorAccordion title="Map Actions">
          <ImportEditor
            handleSaveMap={handleSaveMap}
            onLoadMap={onLoadMap}
          />
        </EditorAccordion>

        {/* Terrain Types */}
        <EditorAccordion title="Terrain Types">
          <TerrainEditor
            selectedTerrain={selectedTerrain}
            onTerrainSelect={onTerrainSelect}
          />
        </EditorAccordion>
      </div>
    </div>
  );
};

export default Palette;

const wrapperStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
} as const;