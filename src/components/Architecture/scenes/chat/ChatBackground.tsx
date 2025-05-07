import React from 'react';

interface ChatBackgroundProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

const ChatBackground: React.FC<ChatBackgroundProps> = ({ 
  backgroundImage,
  backgroundColor = 'rgba(0, 0, 0, 0.8)'
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1
      }}
    />
  );
};

export default ChatBackground; 