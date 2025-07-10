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
        ...wrapperStyle,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundColor,
      }}
    />
  );
};

export default ChatBackground;

const wrapperStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 1
} as const;