import React, { useEffect, useState, useRef } from 'react';
import { MapRenderer } from './MapRenderer';
import BottomBar from '../uiComponent/BottomBar';
import TopBar from '../uiComponent/TopBar';
import { DeploymentCharacter } from '../types/DeploymentCharacter';
import UnitRenderer from './UnitRenderer';

interface DeploymentData {
	stageId: string;
	deployableCells: { x: number; y: number; index: number }[];
	deployedUnits: (DeploymentCharacter & { position: { x: number; y: number } })[];
}

interface Props {
	stageId: string;
}

export const BattlefieldRenderer: React.FC<Props> = ({ stageId }) => {
	const [deploymentData, setDeploymentData] = useState<DeploymentData | null>(null);
	const gameRef = useRef<HTMLDivElement | null>(null);
	const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
	const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

	// Handle map position updates from MapRenderer
	const handleMapUpdate = (position: { x: number, y: number }, dimensions: { width: number, height: number }) => {
		setMapPosition(position);
		setMapDimensions(dimensions);
	};

	useEffect(() => {
		const loadDeploymentData = () => {
			try {
				const storedData = localStorage.getItem(`deployment_${stageId}`);
				if (storedData) {
					const data = JSON.parse(storedData) as DeploymentData;
					setDeploymentData(data);
					// Clear the deployment data after loading it
					//localStorage.removeItem(`deployment_${stageId}`);
				} else {
					console.error('No deployment data found for stage:', stageId);
				}
			} catch (error) {
				console.error('Failed to load deployment data:', error);
			}
		};

		loadDeploymentData();
	}, [stageId]);

	if (!deploymentData) {
		return <div>Loading game...</div>;
	}

	console.log('Deployment data loaded:', deploymentData);

	return (
		<div 
			ref={gameRef}
			style={wrapperStyle}
		>
			<TopBar />
			
			{/* Background and Grid Layer (z-index: 1) */}
			<div style={layerStyle}>
				<MapRenderer 
					mapFile={`map-${stageId}`} 
					onMapUpdate={handleMapUpdate}
				/>
			</div>
			
			{/* Unit Layer (z-index: 3) */}
			{deploymentData.deployedUnits.length > 0 && (
				<div style={{
					...layerStyle,
					zIndex: 3,
					pointerEvents: 'none'
				}}>
					<UnitRenderer 
						units={deploymentData.deployedUnits} 
						mapPosition={mapPosition}
						mapDimensions={mapDimensions}
					/>
				</div>
			)}
			
			<BottomBar />
			
			{/* Future renderers will go here */}
			{/* <div style={{...layerStyle, zIndex: 4}}><EffectRenderer /></div> */}
			{/* <div style={{...layerStyle, zIndex: 5}}><UIRenderer /></div> */}
		</div>
	);
};

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

const layerStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	zIndex: 1
} as const;

