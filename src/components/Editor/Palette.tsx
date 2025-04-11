import React from 'react';
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
  onBackgroundImageChange
}) => {
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
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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