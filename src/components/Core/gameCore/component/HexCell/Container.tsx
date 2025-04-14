import React from "react";
import {TerrainType} from "../../types/TerrainType";


interface Props {
	terrain: TerrainType;
	isHovered: boolean;
	children: React.ReactNode;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

const GRID = {
	WIDTH: 100
};

export const Container: React.FC<Props> = ({
	terrain,
	isHovered,
	children,
	onMouseEnter,
	onMouseLeave
}) => {
	const isSelected = false;

	const onClick = () => {console.log('Mouse clicked a hex cell with terrain ', terrain)}
	//const onContextMenu = () => {console.log('Not implemented')}

	return (
		<div style={getContainerStyle(isSelected, isHovered)}
		     onClick={onClick}
		     onContextMenu={onClick}
		     onMouseEnter={onMouseEnter}
		     onMouseLeave={onMouseLeave}
		>
			{children}
		</div>
	)
}


const getContainerStyle = (isSelected: boolean, isHovered: boolean) => {
	return {
		width: `${GRID.WIDTH}px`,
		height: `${GRID.WIDTH}px`,
		clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'default',
		userSelect: 'none',
		fontSize: '12px',
		margin: 0,
		padding: 0,
		boxSizing: 'border-box',
		flexShrink: 0,
		flexGrow: 0,
		position: 'relative',
		transition: 'background-color 0.2s ease',
		outline: isSelected
			? '2px solid yellow'
			: isHovered
				? '2px solid rgba(255, 255, 255, 0.5)'
				: undefined,
		zIndex: isHovered ? 3 : 1,
	} as const;
}