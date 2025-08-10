import React, { useState, useEffect } from 'react';

interface ConsoleMessage {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
}

const ConsolePanel: React.FC = () => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);

  useEffect(() => {
    const handleConsoleWrite = (event: CustomEvent<{ message: string; type: 'info' | 'warning' | 'error' }>) => {
      const newMessage: ConsoleMessage = {
        id: Date.now().toString(),
        message: event.detail.message,
        timestamp: new Date().toLocaleTimeString(),
        type: event.detail.type
      };
      setMessages(prev => [...prev, newMessage]);
    };

    window.addEventListener('consoleWrite', handleConsoleWrite as EventListener);
    return () => {
      window.removeEventListener('consoleWrite', handleConsoleWrite as EventListener);
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div style={wrapperStyle}>
      <div style={headerWrapperStyle}>
        <h3>Console</h3>
        <ClearLogButton onClear={clearMessages} />
      </div>
      <div style={messageWrapperStyle}>
        {messages.map(msg => (
          <LogMessage msg={msg} />
        ))}
        {messages.length === 0 && (
          <div style={{ color: '#666' }}>No messages</div>
        )}
      </div>
    </div>
  );
};

export default ConsolePanel;

const ClearLogButton = ({onClear}: {onClear: () => void}) => {
  return (
    <button
      onClick={onClear}
      style={clearLogStyle}
    >
      Clear
    </button>
  )
}

const LogMessage = ({msg}: { msg: ConsoleMessage }) => {
  return (
    <div
      key={msg.id}
      style={{
        marginBottom: '5px',
        color: msg.type === 'error' ? '#ff6b6b' :
          msg.type === 'warning' ? '#ffd93d' : '#fff'
      }}
    >
      <TimeStamp timeStamp={msg.timestamp} />
      {msg.message}
    </div>
  )
}

const TimeStamp = ({timeStamp}: { timeStamp: string }) => {
  return (
    <span style={{color: '#888'}}>[{timeStamp}]</span>
  )
}

const wrapperStyle = {
  padding: '20px',
  backgroundColor: '#1e1e1e',
  borderRadius: '8px',
  marginBottom: '20px',
  color: '#fff',
  fontFamily: 'monospace'
}

const headerWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
}

const clearLogStyle = {
  padding: '5px 10px',
  backgroundColor: '#333',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  cursor: 'pointer'
}

const messageWrapperStyle = {
  backgroundColor: '#000',
  padding: '10px',
  borderRadius: '4px',
  height: '200px'
}