import React, { useState, useCallback } from 'react';
import {RequestInputEvent} from "./EventCommand.ts";

interface ChatInputProps {
  event: RequestInputEvent;
  onInputComplete: (value: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ event, onInputComplete }) => {
  const [inputValue, setInputValue] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedValue, setConfirmedValue] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleInputSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setConfirmedValue(inputValue);
      setShowConfirmation(true);
    }
  }, [inputValue]);

  const handleConfirm = useCallback(() => {
    // Store the value in localStorage or global state
    localStorage.setItem(event.targetField, confirmedValue);
    
    // Replace placeholder in confirm message
    const finalMessage = event.confirmMessage.replace(`{${event.targetField}}`, confirmedValue);
    
    // Complete the input event
    onInputComplete(confirmedValue);
  }, [confirmedValue, event, onInputComplete]);

  const handleCancel = useCallback(() => {
    setShowConfirmation(false);
    setInputValue('');
  }, []);

  if (showConfirmation) {
    return (
      <div style={inputContainerStyle}>
        <div style={confirmationStyle}>
          <div style={confirmationMessageStyle}>
            {event.confirmMessage.replace(`{${event.targetField}}`, confirmedValue)}
          </div>
          <div style={buttonContainerStyle}>
            <button 
              onClick={handleConfirm}
              style={confirmButtonStyle}
            >
              确认
            </button>
            <button 
              onClick={handleCancel}
              style={cancelButtonStyle}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={inputContainerStyle}>
      <form onSubmit={handleInputSubmit} style={formStyle}>
        <input
          type={event.inputType === 'number' ? 'number' : 'text'}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="请输入..."
          style={inputStyle}
          autoFocus
        />
        <button type="submit" style={submitButtonStyle}>
          确定
        </button>
      </form>
    </div>
  );
};

// Styles
const inputContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '120px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '80%',
  maxWidth: '400px',
  zIndex: 1000
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 16px',
  fontSize: '16px',
  border: '2px solid #4a90e2',
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: '#333',
  outline: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
};

const submitButtonStyle: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: '16px',
  backgroundColor: '#4a90e2',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.2s'
};

const confirmationStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  textAlign: 'center'
};

const confirmationMessageStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#333',
  marginBottom: '20px',
  lineHeight: '1.5'
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center'
};

const confirmButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '14px',
  backgroundColor: '#34a853',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '14px',
  backgroundColor: '#ea4335',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default ChatInput; 