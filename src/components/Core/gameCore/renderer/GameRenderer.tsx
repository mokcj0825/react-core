import React, { useEffect, useState, useRef } from 'react';
import { MapRenderer } from './MapRenderer';
import BottomBar from '../../../uiComponent/BottomBar';
import TopBar from '../../../uiComponent/TopBar';
interface StageData {
	map: string;
}

interface GameRendererProps {
	stageId: string;
}

export const GameRenderer: React.FC<GameRendererProps> = ({ stageId }) => {
	const [stageData, setStageData] = useState<StageData | null>(null);
	const gameRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const loadStageData = async () => {
			try {
				const stage = await import(`../stage-data/stage-${stageId}`);
				setStageData(stage);
			} catch (error) {
				console.error('Failed to load stage data:', error);
			}
		};

		loadStageData();
	}, [stageId]);

	if (!stageData) {
		return <div>Loading game...</div>;
	}

	return (
		<div 
			ref={gameRef}
			style={wrapperStyle}
		>
			<TopBar />
			<MapRenderer mapFile={stageData.map} />
			<BottomBar />
			{/* Future renderers will go here */}
			{/* <UnitRenderer /> */}
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