import React, { useEffect, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { eventBus, UIEventType, UIEvent } from '../../events/EventBus';

const TopBar: React.FC = () => {
    const [turns, setTurns] = useState<number>(0);
    const [isDay, setIsDay] = useState<boolean>(true);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribeTurn = eventBus.subscribe(UIEventType.TURN_CHANGE, (event: UIEvent) => {
            if (event.payload?.turn !== undefined) {
                setTurns(event.payload.turn);
            }
        });

        const unsubscribeDayNight = eventBus.subscribe(UIEventType.DAY_NIGHT_CHANGE, (event: UIEvent) => {
            if (event.payload?.isDay !== undefined) {
                setIsDay(event.payload.isDay);
            }
        });

        return () => {
            unsubscribeTurn();
            unsubscribeDayNight();
        };
    }, []);

    const handlePlayPauseClick = () => {
        const newPauseState = !isPaused;
        setIsPaused(newPauseState);
        eventBus.publish({
            type: UIEventType.TURN_CHANGE,
            payload: { isDay: isDay }
        });
    };

    return (
        <div style={topBarStyle}>
            <div style={itemStyle}>
                <span style={labelStyle}>Turn:</span>
                <span style={valueStyle}>{turns}</span>
            </div>
            <div style={itemStyle}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isDay ? '#FFD700' : '#191970',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                }}>
                    <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: isDay ? '#FFA500' : '#000080'
                    }} />
                </div>
            </div>
            <div style={itemStyle}>
                <button 
                    onClick={handlePlayPauseClick}
                    style={buttonStyle}
                >
                    {isPaused ? <FaPlay /> : <FaPause />}
                </button>
            </div>
        </div>
    );
};

const topBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    width: '100%',
    boxSizing: 'border-box' as const,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'none' as const
};

const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    pointerEvents: 'none' as const
};

const labelStyle = {
    fontWeight: 'bold',
    fontSize: '16px'
};

const valueStyle = {
    fontSize: '16px'
};

const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto' as const
};

export default TopBar; 