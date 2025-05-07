import React from 'react';

interface Message {
  id: string;
  text: string;
  speaker: string;
  type: 'narrative' | 'dialogue' | 'choice';
  choices?: Array<{
    id: string;
    text: string;
  }>;
}

interface ChatMessageProps {
  message: Message;
  onChoiceSelect?: (choiceId: string) => void;
  onMessageComplete?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onChoiceSelect,
  onMessageComplete 
}) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'narrative':
        return (
          <div style={{ 
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            {message.text}
          </div>
        );
      
      case 'dialogue':
        return (
          <div style={{ 
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#000',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{message.speaker}</div>
            <div>{message.text}</div>
          </div>
        );
      
      case 'choice':
        return (
          <div style={{ 
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px'
          }}>
            <div style={{ marginBottom: '10px' }}>{message.text}</div>
            {message.choices?.map(choice => (
              <button
                key={choice.id}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from bubbling to ChatCore
                  onChoiceSelect?.(choice.id);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
              >
                {choice.text}
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: '800px',
        zIndex: 3
      }}
    >
      {renderMessageContent()}
    </div>
  );
};

export default ChatMessage; 