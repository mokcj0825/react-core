import {HexCoordinate} from "../../types/HexCoordinate";
import React, {useState} from "react";
import {Container} from "./Container";
import {TerrainType} from "../../types/TerrainType";
import {HighlightType} from "../../types/HighlightType";
import { UIEventType, eventBus } from "../../events/EventBus";

interface Props {
	terrain: TerrainType,
	coordinate: HexCoordinate,
	highlight?: HighlightType | undefined,
	fraction?: string,
}

export const HexCell: React.FC<Props> = ({
	                                         terrain,
	                                         coordinate,
	                                         highlight=undefined,
	                                         fraction = 'player',
                                         }) => {

	const [isHovered, setIsHovered] = useState(false);

	const getHighlightType = (): HighlightType | undefined => {
		if (highlight === 'selection') return 'selection';
		if (highlight === 'effect') return 'effect';
		if (highlight === 'deployable') return 'deployable';
		//if (isMoveable) return 'moveable';
		//if (isInZOC) return 'zoc';
		return undefined;
	};

	const handleMouseEnter = () => {
		setIsHovered(true);
		// Notify the GridRenderer that the mouse has entered this cell
		eventBus.publish({
			type: UIEventType.CELL_HOVER,
			payload: {
				coordinate,
				terrain
			}
		});
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		// Notify the GridRenderer that the mouse has left this cell
		eventBus.publish({
			type: UIEventType.CELL_LEAVE
		});
	};

	return (
		<>
			<Container 
				terrain={terrain} 
				isHovered={isHovered}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<Overlay />
				<Highlight highlightType={getHighlightType()}
				           fraction={fraction} />
				<CellContent coordinate={coordinate}/>
				<HoverIndicator isHovered={isHovered} />
				<div>{terrain}</div>
			</Container>
		</>
	)
}

const Overlay: React.FC = () => (
	<>
		<div style={overlayWrapperStyle}/>
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
	</>
);

const Highlight: React.FC<{
	highlightType: HighlightType | undefined,
	fraction: string
}> = ({
	      highlightType,
	      fraction,
      }) => {
	if (!highlightType) return null;

	const getHighlightStyle = (): React.CSSProperties => {
		switch (highlightType) {
			case 'selection':
				return {
					backgroundColor: 'rgba(255, 255, 0, 0.3)',
					border: '2px solid rgba(255, 255, 0, 0.6)'
				};
			case 'effect':
				return {
					backgroundColor: 'rgba(255, 0, 0, 0.3)',
					border: '2px solid rgba(255, 0, 0, 0.6)'
				};
			case 'moveable':
				return {
					backgroundColor: fraction === 'enemy' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
					border: `2px solid ${fraction === 'enemy' ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 255, 0, 0.4)'}`
				};
			case 'zoc':
				return {
					backgroundColor: 'rgba(255, 165, 0, 0.2)',
					border: '2px solid rgba(255, 165, 0, 0.4)'
				};
			case 'deployable':
				return {
					backgroundColor: 'rgba(0, 0, 255, 0.2)',
					border: '2px solid rgba(0, 0, 255, 0.4)'
				};
			default:
				return {};
		}
	};

	return (
		<div
			className="hex-cell-highlight"
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: 'none',
				zIndex: 2,
				...getHighlightStyle(),
			}}
		/>
	);
};

const CellContent: React.FC<{coordinate: HexCoordinate}> = ({
	                                                            coordinate
                                                            }) => (
	<div style={{
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		pointerEvents: 'none',
		zIndex: 3
	}}
	>

		<div style={cellContentStyle}>
			{coordinate.x},{coordinate.y}
		</div>

	</div>
)

const HoverIndicator: React.FC <{isHovered: boolean; isSelected?: boolean}> = ({isHovered, isSelected = false}) => {
	return (<div style={getHoverIndicator(isHovered, isSelected)}
	/>)
}

const overlayWrapperStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: '#FFFFFF',
	opacity: 0.2,
	pointerEvents: 'none',
	zIndex: 1,
} as const;

const cellContentStyle = {position: 'absolute',
	bottom: '2px',
	left: '2px',
	fontSize: '10px',
	color: 'rgba(0, 0, 0, 0.7)'
} as const;

const getHoverIndicator = (isHovered: boolean, isSelected: boolean) => {
	return {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		clipPath: 'polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)',
		transition: 'all 0.2s ease',
		pointerEvents: 'none',
		zIndex: 5,
		backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
		outline: isSelected ? '2px solid yellow' : 'none',
	} as const;
}