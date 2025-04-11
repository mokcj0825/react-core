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
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #ccc',
      }}>
        <h2>Map Editor</h2>
      </div>
      
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h3>Map Size</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Width:</label>
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
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Height:</label>
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
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3>Background Image</h3>
          <div style={{ marginBottom: '12px' }}>
            <label 
              htmlFor="background-image"
              style={{ 
                display: 'block',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                textAlign: 'center',
              }}
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

        <div>
          <h3>Terrain Types</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}>
            {TERRAIN_TYPES.map((terrain) => (
              <button
                key={terrain}
                onClick={() => onTerrainSelect(terrain)}
                style={{
                  padding: '8px',
                  border: selectedTerrain === terrain ? '2px solid #4CAF50' : '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: selectedTerrain === terrain ? '#E8F5E9' : '#fff',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {terrain}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Palette; 