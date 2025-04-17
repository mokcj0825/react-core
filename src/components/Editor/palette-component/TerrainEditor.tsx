import React from 'react';
import { TerrainType } from '../../Core/gameCore/types/TerrainType';

interface Props {
  selectedTerrain: TerrainType;
  onTerrainSelect: (terrain: TerrainType) => void;
}

// Define terrain types
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

const TerrainEditor: React.FC<Props> = ({
  selectedTerrain,
  onTerrainSelect
}) => {

    return (
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
    )
}

export default TerrainEditor;