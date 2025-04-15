import React from 'react';
import {GridLayout} from "../../Core/gameCore/system-config/GridLayout.ts";
import {Vector2D} from "../utils/Vector2D.ts";

interface Props {
	coordinate: Vector2D;
	terrainColor: string;
	handleMouseDown: (clientX: number, clientY: number) => void;
	handleMouseMove: (clientX: number, clientY: number) => void;
	deployable?: boolean;
	deployableIndex?: number;
}

const HexaCellRenderer: React.FC<Props> = ({
	coordinate,
	terrainColor,
	handleMouseMove,
	handleMouseDown,
	deployable = false,
	deployableIndex = 0,
}) => {
	return (
		<div
			id={`hex-${coordinate.x}-${coordinate.y}`}
			key={`${coordinate.x},${coordinate.y}`}
			onMouseDown={(e) => handleMouseDown(e.clientX, e.clientY)}
			onMouseMove={(e) => handleMouseMove(e.clientX, e.clientY)}
			style={{
				width: `${GridLayout.WIDTH}px`,
				height: `${GridLayout.WIDTH}px`,
				clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				userSelect: 'none',
				fontSize: '12px',
				margin: 0,
				padding: 0,
				boxSizing: 'border-box',
				flexShrink: 0,
				flexGrow: 0,
				position: 'relative',
				backgroundColor: terrainColor,
				zIndex: 1,
				opacity: 0.5,
			}}
		>
			{/* Border for better visibility */}
			<svg
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					pointerEvents: 'none',
					zIndex: 2,
				}}
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
			>
				<path
					d="M0 25 L0 75 L50 100 L100 75 L100 25 L50 0 Z"
					fill="none"
					stroke="#8B4513"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>

			{/* Coordinate display */}
			<div style={{
				position: 'absolute',
				bottom: '2px',
				left: '2px',
				fontSize: '10px',
				color: 'rgba(0, 0, 0, 0.7)',
				zIndex: 3,
			}}>
				{coordinate.x},{coordinate.y}
			</div>
			{deployable && deployableIndex != undefined && (
				<div style={deployableIndicatorStyle}>
					{deployableIndex}
				  </div>
			)}

		</div>
	)
}

export default HexaCellRenderer;

const deployableIndicatorStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	fontSize: '16px',
	fontWeight: 'bold',
	color: '#000',
	zIndex: 3,
	backgroundColor: 'rgba(255, 255, 255, 0.7)',
	borderRadius: '50%',
	width: '24px',
	height: '24px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
} as const;