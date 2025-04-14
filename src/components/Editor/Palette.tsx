import React, { useRef } from 'react';
import { TerrainType } from '../Core/gameCore/types/TerrainType';

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

const TERRAIN_TYPES: TerrainType[] = [
  'plain',
  'mountain',
  'forest',
  'sea',
  'river',
  'cliff',
  'road',
  'wasteland',
  'ruins',
  'swamp',
];

// Define colors for each terrain type
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapFileInputRef = useRef<HTMLInputElement>(null);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    if (!isNaN(newWidth) && newWidth > 0) {
      onWidthChange(newWidth);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10);
    if (!isNaN(newHeight) && newHeight > 0) {
      onHeightChange(newHeight);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onBackgroundImageChange(imageUrl);
    }
  };

  const handleSaveMap = () => {
    // Create the map data object with backgroundImage as undefined
    const mapData: MapData = {
      width,
      height,
      terrain, // Use the terrain array directly without any mapping
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

  const handleLoadMap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const mapData = JSON.parse(event.target?.result as string) as MapData;
          onLoadMap(mapData);
        } catch (error) {
          console.error('Error parsing map data:', error);
          alert('Failed to load map data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
    }}>
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
        <div style={{ 
          marginBottom: '24px',
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Map Size</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', color: '#555' }}>Width:</label>
            <input 
              type="number" 
              value={width}
              onChange={handleWidthChange}
              min="1"
              style={{ 
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', color: '#555' }}>Height:</label>
            <input 
              type="number" 
              value={height}
              onChange={handleHeightChange}
              min="1"
              style={{ 
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        <div style={{ 
          marginBottom: '24px',
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Background Image</h3>
          <div style={{ marginBottom: '12px' }}>
            <label 
              htmlFor="background-image"
              style={{ 
                display: 'block',
                padding: '10px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background-color 0.2s',
                color: '#555',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            >
              {backgroundImage ? 'Change Image' : 'Choose Image'}
            </label>
            <input 
              id="background-image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div style={{ 
          marginBottom: '24px',
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Map Actions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}>
            <button
              onClick={handleSaveMap}
              style={{
                padding: '12px',
                border: '1px solid #4CAF50',
                borderRadius: '8px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                color: '#4CAF50',
                fontWeight: 'bold',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#E8F5E9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              Save Map
            </button>
            <label 
              htmlFor="load-map"
              style={{ 
                padding: '12px',
                border: '1px solid #2196F3',
                borderRadius: '8px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                color: '#2196F3',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#E3F2FD';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              Load Map
            </label>
            <input 
              id="load-map"
              ref={mapFileInputRef}
              type="file"
              accept=".json"
              onChange={handleLoadMap}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Terrain Types</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            {TERRAIN_TYPES.map((terrain) => (
              <button
                key={terrain}
                onClick={() => onTerrainSelect(terrain)}
                style={{
                  padding: '12px',
                  border: selectedTerrain === terrain ? '2px solid #4CAF50' : '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: selectedTerrain === terrain ? '#E8F5E9' : '#fff',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: selectedTerrain === terrain ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  if (selectedTerrain !== terrain) {
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTerrain !== terrain) {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: TERRAIN_COLORS[terrain],
                  marginRight: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                }}></div>
                <span style={{ 
                  fontWeight: selectedTerrain === terrain ? 'bold' : 'normal',
                  color: selectedTerrain === terrain ? '#2E7D32' : '#333',
                }}>
                  {terrain}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Palette; 