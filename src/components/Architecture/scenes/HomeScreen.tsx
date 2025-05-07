import React from 'react';
import { useTheater } from '../TheaterCore';

// Button style to be reused
const buttonStyle: React.CSSProperties = {
  backgroundColor: 'rgba(66, 133, 244, 0.9)',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '15px 30px',
  margin: '10px 0',
  width: '200px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
};

const HomeScreen: React.FC = () => {
  // Get the theater event dispatcher
  const { dispatchTheaterEvent } = useTheater();

  // Event handlers for buttons
  const handleStartGame = () => {
    dispatchTheaterEvent({ type: 'START_GAME' });
  };

  const handleLoadGame = () => {
    dispatchTheaterEvent({ type: 'LOAD_GAME' });
  };

  const handleSettings = () => {
    dispatchTheaterEvent({ type: 'SHOW_SETTINGS' });
  };

  const handleExit = () => {
    dispatchTheaterEvent({ type: 'EXIT_GAME' });
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      border: '2px dashed #4285F4',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(66, 133, 244, 0.1)'
    }}>
      <div style={{
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '36px', color: '#333' }}>Title</h1>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <button 
          style={buttonStyle}
          onClick={handleStartGame}
        >
          Start Game
        </button>
        <button 
          style={buttonStyle}
          onClick={handleLoadGame}
        >
          Load Game
        </button>
        <button 
          style={buttonStyle}
          onClick={handleSettings}
        >
          Settings
        </button>
        <button 
          style={{
            ...buttonStyle,
            backgroundColor: 'rgba(234, 67, 53, 0.9)'
          }}
          onClick={handleExit}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default HomeScreen; 