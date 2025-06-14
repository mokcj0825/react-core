import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheater } from '../../TheaterCore';
import ChatBackground from './ChatBackground';
//import CharacterSprite from './CharacterSprite';
import ChatMessage from './ChatMessage';

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

type ChatEvent = ShowMessageEvent | WriteConsoleEvent;

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
  const { sceneResource, dispatchSceneCommand } = useTheater();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the current event to prevent recalculation
  const currentEvent = useMemo(() => {
    if (!chatData) return null;
    return chatData.events[currentEventIndex];
  }, [chatData, currentEventIndex]);

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
  }, [chatData, currentEventIndex, dispatchSceneCommand]);

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

  useEffect(() => {
    if (!sceneResource) {
      setLoading(false);
      return;
    }

    const fetchChatData = async () => {
      try {
        setLoading(true);
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        const response = await fetch(`/architecture/${selectedTestCase}/${sceneResource}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch chat data: ${response.status}`);
        }
        const data = await response.json();
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

    case 'SHOW_MESSAGE':
      return (
        <div style={containerStyles} onClick={handleClick}>
          <ChatBackground />
          <ChatMessage
            message={{
              id: currentEventIndex.toString(),
              text: currentEvent.message,
              speaker: currentEvent.characterName,
              type: 'dialogue'
            }}
            onMessageComplete={handleMessageComplete}
          />
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