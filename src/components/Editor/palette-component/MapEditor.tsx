import React from 'react';
import { Vector2D } from '../utils/Vector2D';

interface Props {
    dimensions: Vector2D;
    onDimensionsChange: (dimensions: Vector2D) => void;
}

const MapEditor: React.FC<Props>  = ({
    dimensions,
    onDimensionsChange
}) => {

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value, 10);
        onDimensionsChange({x: newWidth, y: dimensions.y});
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseInt(e.target.value, 10);
        onDimensionsChange({x: dimensions.x, y: newHeight});
    };
	return (
		<div style={wrapperStyle}>
			<div>
				<label style={inputLabelStyle}>Width:</label>
				<input
					type="number"
					value={dimensions.x}
					onChange={handleWidthChange}
					min="1"
					style={inputStyle}
				/>
			</div>
			<div>
				<label style={inputLabelStyle}>Height:</label>
				<input
					type="number"
					value={dimensions.y}
					onChange={handleHeightChange}
					min="1"
					style={inputStyle}
				/>
			</div>
		</div>
	)
}

export default MapEditor;

const wrapperStyle = {
	marginBottom: '24px',
	backgroundColor: '#fff',
	borderRadius: '8px',
	boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
} as const;


const inputLabelStyle = {display: 'block', marginBottom: '4px', color: '#555'} as const;

const inputStyle = {
	width: '100%',
	padding: '8px',
	borderRadius: '4px',
	border: '1px solid #ccc',
	fontSize: '14px',
} as const;