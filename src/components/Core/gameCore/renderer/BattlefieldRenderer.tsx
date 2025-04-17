import React, { useEffect, useState, useRef } from 'react';
import { MapRenderer } from './MapRenderer';
import BottomBar from '../uiComponent/BottomBar';
import TopBar from '../uiComponent/TopBar';
import { DeploymentCharacter } from '../types/DeploymentCharacter';

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

	useEffect(() => {
		const loadDeploymentData = () => {
			try {
				const storedData = localStorage.getItem(`deployment_${stageId}`);
				if (storedData) {
					const data = JSON.parse(storedData) as DeploymentData;
					setDeploymentData(data);
					// Clear the deployment data after loading it
					localStorage.removeItem(`deployment_${stageId}`);
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
			<MapRenderer mapFile={`map-${stageId}`} />
			<BottomBar />
			{/* Future renderers will go here */}
			{/* <UnitRenderer units={deploymentData.deployedUnits} /> */}
			{/* <EffectRenderer /> */}
			{/* <UIRenderer /> */}
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