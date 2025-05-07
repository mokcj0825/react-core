import React from 'react';
import ChatCore from './chat/ChatCore';

const Chat: React.FC = () => {
  return (
    <div style={wrapper}>
      <ChatCore />
    </div>
  );
};

export default Chat;

const wrapper = {
  width: '100%',
  height: '100%',
  border: '2px dashed #4A90E2',
  borderRadius: '4px',
  position: 'relative',
  overflow: 'hidden'
} as const;