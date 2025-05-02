import React, { useEffect, useState } from 'react';
import { EventCommand } from '../EventCommand';
import { DialogEvent } from '../utils/DialogEvent';

/**
 * Types and interfaces for message display
 */
export interface ShowMessageEvent extends DialogEvent {
	eventCommand: EventCommand.SHOW_MESSAGE;
	message: string;
	characterName?: string;
}

export enum SpritePosition {
	LEFT = 'LEFT',
	MIDDLE = 'MIDDLE',
	RIGHT = 'RIGHT'
}

/**
 * Type guard to check if an event is a show message event
 */
export const isShowMessageEvent = (event: DialogEvent): event is ShowMessageEvent => {
	return event.eventCommand === EventCommand.SHOW_MESSAGE && 'message' in event;
};

interface ShowMessageProps {
	event: DialogEvent;
}

/**
 * ShowMessage component - Renders a visual novel style message box
 */
const ShowMessage: React.FC<ShowMessageProps> = ({ event }) => {
	if (!isShowMessageEvent(event)) {
		return null;
	}

	const { characterName = SpritePosition.MIDDLE, message } = event;
	const [indicatorOpacity, setIndicatorOpacity] = useState(0.5);
	
	// Animation for the continue indicator
	useEffect(() => {
		let increasing = true;
		const interval = setInterval(() => {
			setIndicatorOpacity(prev => {
				if (increasing) {
					const newValue = prev + 0.05;
					if (newValue >= 1) increasing = false;
					return Math.min(newValue, 1);
				} else {
					const newValue = prev - 0.05;
					if (newValue <= 0.5) increasing = true;
					return Math.max(newValue, 0.5);
				}
			});
		}, 50);
		
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<div style={visualNovelTextBoxStyle}>
				{characterName && <div style={nameBoxStyle}>{characterName}</div>}
				<div style={messageTextStyle}>{MessageUtils.processMessage(message)}</div>
				<div style={{...continueIndicatorStyle, opacity: indicatorOpacity}} />
			</div>
		</>
	);
};

/**
 * Utility class for message text processing
 */
class MessageUtils {
	public static processMessage(message: string): string {
		return message.replace(/\{([^}]+)\}/g, (match, variableName) => {
			const value = localStorage.getItem(variableName);
			return value || match;
		});
	}
}

/**
 * Style objects for the visual novel dialog interface
 */
const visualNovelTextBoxStyle: React.CSSProperties = {
	position: 'absolute',
	bottom: '30px',
	left: '50%',
	transform: 'translateX(-50%)',
	width: '90%',
	minHeight: '180px',
	background: 'rgba(0, 0, 0, 0.7)',
	border: '2px solid #a67c52',
	borderRadius: '10px',
	padding: '20px',
	color: 'white',
	zIndex: 10,
	boxShadow: '0 5px 20px rgba(0, 0, 0, 0.5)'
};

const nameBoxStyle: React.CSSProperties = {
	position: 'absolute',
	top: '-22px',
	left: '20px',
	background: '#a67c52',
	padding: '5px 15px',
	borderRadius: '5px 5px 0 0',
	color: 'white',
	fontWeight: 'bold',
	fontSize: '18px',
	boxShadow: '0 -3px 10px rgba(0, 0, 0, 0.3)'
};

const messageTextStyle: React.CSSProperties = {
	fontSize: '20px',
	lineHeight: 1.5,
	letterSpacing: '0.5px',
	marginTop: '5px'
};

const continueIndicatorStyle: React.CSSProperties = {
	position: 'absolute',
	bottom: '15px',
	right: '20px',
	width: '20px',
	height: '20px',
	borderRight: '3px solid white',
	borderBottom: '3px solid white',
	transform: 'rotate(-45deg)',
	transition: 'opacity 0.1s ease'
};

export default ShowMessage;