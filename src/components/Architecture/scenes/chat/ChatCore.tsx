import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheater } from '../../TheaterCore';
import ChatBackground from './ChatBackground';
//import CharacterSprite from './CharacterSprite';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ShowMessageEvent {
  eventCommand: 'SHOW_MESSAGE';
  characterName: string;
  message: string;
}

interface WriteConsoleEvent {
  eventCommand: 'WRITE_CONSOLE';
  message: string;
  type: 'info' | 'warning' | 'error';
}

interface RequestInputEvent {
  eventCommand: 'REQUEST_INPUT';
  inputType: 'string' | 'number';
  targetField: string;
  confirmMessage: string;
}

interface WriteValueEvent {
  eventCommand: 'WRITE_VALUE';
  target: string;
  operation: string;
  value: any;
}

interface ShowOptionEvent {
  eventCommand: 'SHOW_OPTION';
  options: Array<{
    text: string;
    command: 'INJECT_SCRIPT';
    scriptResource: string;
  }>;
}

type ChatEvent = ShowMessageEvent | WriteConsoleEvent | RequestInputEvent | WriteValueEvent | ShowOptionEvent;

interface FinishEvent {
  eventCommand: 'INVOKE_SCENE' | 'HIDE_SCENE';
  scene: string;
  sceneResource: string;
}

interface ChatData {
  events: ChatEvent[];
  finishEvent: FinishEvent;
}

const ChatCore: React.FC = () => {
  const { getSceneResource, dispatchSceneCommand } = useTheater();
  const sceneResource = getSceneResource('chat');
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [injectedEvents, setInjectedEvents] = useState<ChatEvent[]>([]);
  const [injectedEventIndex, setInjectedEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility function to replace template variables in messages
  const replaceTemplateVariables = useCallback((message: string): string => {
    return message.replace(/\{(\w+)\}/g, (match, fieldName) => {
      const value = localStorage.getItem(fieldName);
      return value || match; // Return original if not found
    });
  }, []);

  // Memoize the current event to prevent recalculation
  const currentEvent = useMemo(() => {
    if (!chatData) return null;
    
    // If we have injected events and haven't finished them, use injected events
    if (injectedEvents.length > 0 && injectedEventIndex < injectedEvents.length) {
      return injectedEvents[injectedEventIndex];
    }
    
    // Otherwise use main chat events
    return chatData.events[currentEventIndex];
  }, [chatData, currentEventIndex, injectedEvents, injectedEventIndex]);

  // Memoize the common container styles
  const containerStyles = useMemo(() => ({
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  }), []);

  // Memoize handleMessageComplete to prevent recreation
  const handleMessageComplete = useCallback(() => {
    if (!chatData) return;

    // If we're in injected events, handle them first
    if (injectedEvents.length > 0 && injectedEventIndex < injectedEvents.length) {
      if (injectedEventIndex < injectedEvents.length - 1) {
        setInjectedEventIndex(prev => prev + 1);
      } else {
        // Injected events finished, clear them and continue with main events
        setInjectedEvents([]);
        setInjectedEventIndex(0);
        setCurrentEventIndex(prev => prev + 1);
      }
      return;
    }

    // Handle main chat events
    if (currentEventIndex < chatData.events.length - 1) {
      setCurrentEventIndex(prev => prev + 1);
    } else {
      // All messages shown, trigger finish event
      if (chatData.finishEvent.eventCommand === 'HIDE_SCENE') {
        dispatchSceneCommand({
          command: 'HIDE_SCENE',
          scene: 'chat'
        });
      } else {
        dispatchSceneCommand({
          command: chatData.finishEvent.eventCommand,
          scene: chatData.finishEvent.scene as any,
          sceneResource: chatData.finishEvent.sceneResource
        });
      }
    }
  }, [chatData, currentEventIndex, injectedEvents, injectedEventIndex, dispatchSceneCommand]);

  // Memoize handleClick to prevent recreation
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Check if the click was on an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, input, select, textarea, [role="button"]');
    
    // Only proceed if not clicking an interactive element
    if (!isInteractive) {
      handleMessageComplete();
    }
  }, [handleMessageComplete]);

  // Memoize the console event dispatch
  const dispatchConsoleEvent = useCallback((message: string, type: 'info' | 'warning' | 'error') => {
    const consoleEvent = new CustomEvent('consoleWrite', {
      detail: { message, type }
    });
    window.dispatchEvent(consoleEvent);
  }, []);

  // Memoize handleInputComplete to prevent recreation
  const handleInputComplete = useCallback((value: string) => {
    // Input completed, move to next event
    handleMessageComplete();
  }, [handleMessageComplete]);

  // Handle option selection and script injection
  const handleOptionSelect = useCallback(async (scriptResource: string) => {
    try {
      const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
      const response = await fetch(`/architecture/${selectedTestCase}/${scriptResource}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch script: ${response.status}`);
      }
      const scriptData = await response.json();
      
      // Inject the script events
      setInjectedEvents(scriptData.events || []);
      setInjectedEventIndex(0);
      
      // Move to next main event (the option selection is complete)
      setCurrentEventIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error injecting script:', err);
      // If injection fails, just move to next event
      setCurrentEventIndex(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    if (!sceneResource) {
      setLoading(false);
      return;
    }

    // Reset internal state when sceneResource changes
    setCurrentEventIndex(0);
    setInjectedEvents([]);
    setInjectedEventIndex(0);
    setChatData(null);
    setError(null);

    const fetchChatData = async () => {
      try {
        setLoading(true);
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        const response = await fetch(`/architecture/${selectedTestCase}/${sceneResource}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch chat data: ${response.status}`);
        }
        const data = await response.json();
        console.log('chat data', data);
        setChatData(data);
        setLoading(false);
      } catch (err) {
        console.log('Error fetching chat data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchChatData();
  }, [sceneResource]);

  if (loading) {
    return <div>Loading chat data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!chatData || !currentEvent) {
    return <div>No chat data available</div>;
  }

  // Handle different commands using switch-case
  switch (currentEvent.eventCommand) {
    case 'WRITE_CONSOLE':
      // Dispatch console event and move to next event
      dispatchConsoleEvent(currentEvent.message, currentEvent.type);
      handleMessageComplete();
      return (
        <div style={containerStyles} onClick={handleClick}>
          <ChatBackground />
        </div>
      );

    case 'WRITE_VALUE':
      // Handle WRITE_VALUE command to update localStorage - auto-execute
      if (currentEvent.target && currentEvent.value !== undefined) {
        localStorage.setItem(currentEvent.target, String(currentEvent.value));
        console.log(`WRITE_VALUE: Set ${currentEvent.target} = ${currentEvent.value}`);
      }
      handleMessageComplete();
      return (
        <div style={containerStyles} onClick={handleClick}>
          <ChatBackground />
        </div>
      );

    case 'SHOW_MESSAGE':
      return (
        <div style={containerStyles} onClick={handleClick}>
          <ChatBackground />
          <ChatMessage
            message={{
              id: currentEventIndex.toString(),
              text: replaceTemplateVariables(currentEvent.message),
              speaker: replaceTemplateVariables(currentEvent.characterName),
              type: 'dialogue'
            }}
            onMessageComplete={handleMessageComplete}
          />
        </div>
      );

    case 'REQUEST_INPUT':
      return (
        <div style={containerStyles}>
          <ChatBackground />
          <ChatInput
            event={currentEvent}
            onInputComplete={handleInputComplete}
          />
        </div>
      );

    case 'SHOW_OPTION':
      return (
        <div style={containerStyles}>
          <ChatBackground />
          <div style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minWidth: '300px'
          }}>
            {currentEvent.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option.scriptResource)}
                style={{
                  padding: '15px 20px',
                  border: '2px solid #34A853',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(52, 168, 83, 0.1)',
                  color: '#34A853',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(52, 168, 83, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(52, 168, 83, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      );

    default:
      const unknownEvent = currentEvent as ChatEvent;
      console.warn('Unknown event command:', unknownEvent.eventCommand);
      return (
        <div style={containerStyles} onClick={handleClick}>
          <ChatBackground />
        </div>
      );
  }
};

export default React.memo(ChatCore); 