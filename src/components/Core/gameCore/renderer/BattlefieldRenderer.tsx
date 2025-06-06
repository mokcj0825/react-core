import React, { useEffect, useState, useRef } from 'react';
import { MapRenderer } from './MapRenderer';
import BottomBar from '../uiComponent/BottomBar';
import TopBar from '../uiComponent/TopBar';
import { DeploymentCharacter } from '../types/DeploymentCharacter';
import UnitRenderer from './UnitRenderer';
import { Origin2D, Vector2D } from "../../../Editor/utils/Vector2D";

interface DeploymentData {
	stageId: string;
	deployableCells: { x: number; y: number; index: number }[];
	deployedUnits: (DeploymentCharacter & { position: Vector2D })[];
}

interface Props {
	stageId: string;
}

export const BattlefieldRenderer: React.FC<Props> = ({ stageId }) => {
	const [deploymentData, setDeploymentData] = useState<DeploymentData | null>(null);
	const gameRef = useRef<HTMLDivElement | null>(null);
	const mapDimensionsRef = useRef<Vector2D>(Origin2D);
	
	// Only store map dimensions, not position
	const handleMapUpdate = (position: Vector2D, dimensions: Vector2D) => {
		mapDimensionsRef.current = dimensions;
		//console.log('position', position);
	};

	useEffect(() => {
		const loadDeploymentData = async () => {
			// Try to load from localStorage first
			const storedData = localStorage.getItem(`deployment_${stageId}`);
			console.log('storedData', storedData);
			if (storedData) {
				const data = JSON.parse(storedData) as DeploymentData;
				setDeploymentData(data);
				localStorage.removeItem(`deployment_${stageId}`);
			} else {
				// If not in localStorage, assume no pre-deployed units
				setDeploymentData({
					stageId,
					deployableCells: [],
					deployedUnits: []
				});
			}
		};

		loadDeploymentData();
	}, [stageId]);

	if (!deploymentData) {
		return <div>Loading game...</div>;
	}

	console.log('Deployment data loaded:', deploymentData);

	// Pass both the unit and map renderer as children
	const renderContent = () => {
		return (
			<>
				<MapRenderer 
					mapFile={`${stageId}`} 
					onMapUpdate={handleMapUpdate}
				>
					{deploymentData.deployedUnits.length > 0 && (
						<UnitRenderer 
							units={deploymentData.deployedUnits} 
							mapDimensions={mapDimensionsRef.current}
						/>
					)}
				</MapRenderer>
			</>
		);
	};

	return (
		<div 
			ref={gameRef}
			style={wrapperStyle}
		>
			<TopBar />
			<div style={battlefieldContainerStyle}>
				{renderContent()}
			</div>
			<BottomBar />
		</div>
	);
};

// Main container
const wrapperStyle = {
	width: '100%',
	height: '100vh',
	position: 'relative',
	backgroundColor: '#FFE4C4',
	userSelect: 'none',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-between',
	overflow: 'hidden'
} as const;

const battlefieldContainerStyle = {
	position: 'relative',
	width: '100%',
	height: '100%', 
	flex: 1,
	overflow: 'hidden'
} as const;

