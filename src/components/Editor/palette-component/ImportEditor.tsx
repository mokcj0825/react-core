import React, { useRef } from 'react';
import { MapData } from '../Palette';

interface Props {
	handleSaveMap: () => void;
	onLoadMap: (mapData: MapData) => void;
}

const ImportEditor: React.FC<Props> = ({
	                                       handleSaveMap,
	                                       onLoadMap
                                       }) => {

	const mapFileInputRef = useRef<HTMLInputElement>(null);

	const handleLoadMap = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const mapData = JSON.parse(event.target?.result as string) as MapData;
					// Flip the terrain array back to match the editor's coordinate system
					// where (0,0) is top-left and terrain array is [top row...bottom row]
					const flippedMapData = {
						...mapData,
						terrain: mapData.terrain.slice().reverse(),
						// Keep deployable cells as they are, since they're already in the correct coordinate system
						deployableCells: mapData.deployableCells || []
					};
					onLoadMap(flippedMapData);
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
			display: 'grid',
			gridTemplateColumns: '1fr 1fr',
			gap: '12px',
		}}>
			<button
				onClick={handleSaveMap}
				style={saveButtonStyle}
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
				style={loadButtonStyle}
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
				style={{display: 'none'}}
			/>
		</div>
	)
}

export default ImportEditor;const saveButtonStyle = {
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
} as const;

const loadButtonStyle = {
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
} as const;

