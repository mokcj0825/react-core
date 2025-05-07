import React, { useState, useEffect } from 'react';
import { useTheater } from '../../TheaterCore';
import ChatBackground from './ChatBackground';
import CharacterSprite from './CharacterSprite';
import ChatMessage from './ChatMessage';

interface ChatEvent {
  eventCommand: 'SHOW_MESSAGE';
  characterName: string;
  message: string;
}

interface FinishEvent {
  eventCommand: 'INVOKE_SCENE';
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

  useEffect(() => {
    if (!sceneResource) {
      setLoading(false);
      return;
    }

    const fetchChatData = async () => {
      try {
        setLoading(true);
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        const response = await fetch(`/architecture/${selectedTestCase}${sceneResource}`);
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

  const handleMessageComplete = () => {
    if (!chatData) return;

    if (currentEventIndex < chatData.events.length - 1) {
      setCurrentEventIndex(prev => prev + 1);
    } else {
      // All messages shown, trigger finish event
      dispatchSceneCommand({
        command: 'INVOKE_SCENE',
        scene: chatData.finishEvent.scene as any,
        sceneResource: chatData.finishEvent.sceneResource
      });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Check if the click was on an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, input, select, textarea, [role="button"]');
    
    // Only proceed if not clicking an interactive element
    if (!isInteractive) {
      handleMessageComplete();
    }
  };

  if (loading) {
    return <div>Loading chat data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!chatData) {
    return <div>No chat data available</div>;
  }

  const currentEvent = chatData.events[currentEventIndex];

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        cursor: 'pointer' // Indicate clickability
      }}
      onClick={handleClick}
    >
      <ChatBackground />
      
      {currentEvent && (
        <ChatMessage
          message={{
            id: currentEventIndex.toString(),
            text: currentEvent.message,
            speaker: currentEvent.characterName,
            type: 'dialogue'
          }}
          onMessageComplete={handleMessageComplete}
        />
      )}
    </div>
  );
};

export default ChatCore; 