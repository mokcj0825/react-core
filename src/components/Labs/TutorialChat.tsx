import React from 'react';
import MaskLayer from './MaskLayer';

const TutorialChat: React.FC = () => {
  const handleOverlayClick = () => {
    console.log("overlay clicked");
  };

  const handleChildClick = () => {
    console.log("child clicked");
  };

  return (
    <>
      <MaskLayer
        holePosition={{ x: '50%', y: '50%', size: '50px', anchor: 'ANCHOR_MIDDLE' }}
        onOverlayClick={handleOverlayClick}
      >
      </MaskLayer>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div 
          onClick={handleChildClick}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Button here
        </div>
      </div>
    </>
  );
};

export default TutorialChat;
