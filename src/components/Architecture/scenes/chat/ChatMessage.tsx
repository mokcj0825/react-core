import React, { useState, useEffect, useCallback } from 'react';

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

interface TextSegment {
  text: string;
  style: React.CSSProperties;
  pause?: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onChoiceSelect,
  onMessageComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [textSegments, setTextSegments] = useState<TextSegment[]>([]);

  // Parse text with new SQL-like command system
  const parseText = useCallback((rawText: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    let currentIndex = 0;
    
    // Regular expression to match the new command format
    const commandRegex = /\{([^}]+)\}/g;
    let match;
    
    while ((match = commandRegex.exec(rawText)) !== null) {
      // Add text before the command
      if (match.index > currentIndex) {
        const textBefore = rawText.slice(currentIndex, match.index);
        if (textBefore) {
          segments.push({
            text: textBefore,
            style: {}
          });
        }
      }
      
      const command = match[1];
      
      // Handle PAUSE command (simple case)
      if (command.startsWith('PAUSE(')) {
        const pauseMatch = command.match(/PAUSE\((\d+)\)/);
        if (pauseMatch) {
          segments.push({
            text: '',
            style: {},
            pause: parseInt(pauseMatch[1])
          });
        }
      } else {
        // Handle complex attribute chains
        const toMatch = command.match(/\.TO\('([^']+)'\)/);
        if (toMatch) {
          const targetText = toMatch[1];
          const style = parseAttributeChain(command);
          
          segments.push({
            text: targetText,
            style
          });
        }
      }
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < rawText.length) {
      const remainingText = rawText.slice(currentIndex);
      if (remainingText) {
        segments.push({
          text: remainingText,
          style: {}
        });
      }
    }
    
    return segments;
  }, []);

  // Parse attribute chain like STYLE('BOLD').SIZE('LARGE').FONT_COLOR('#FF0000')
  const parseAttributeChain = useCallback((command: string): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    // Extract all attribute calls
    const attributeRegex = /(\w+)\(['"]([^'"]+)['"]\)/g;
    let attrMatch;
    
    while ((attrMatch = attributeRegex.exec(command)) !== null) {
      const [fullMatch, attribute, value] = attrMatch;
      
      switch (attribute) {
        case 'STYLE':
          if (value === 'BOLD') {
            style.fontWeight = 'bold';
          }
          break;
        case 'SIZE':
          switch (value) {
            case 'LARGE':
              style.fontSize = '1.5em';
              break;
            case 'SMALL':
              style.fontSize = '0.8em';
              break;
          }
          break;
        case 'FONT_COLOR':
          // Use the value directly since it should already include the # prefix
          style.color = value;
          break;
      }
    }
    
    return style;
  }, []);

  // Process text with PAUSE commands and styled segments
  useEffect(() => {
    const processTextWithCommands = async () => {
      setDisplayedText('');
      setIsComplete(false);
      
      const segments = parseText(message.text);
      setTextSegments(segments);
      
      let result = '';
      
      for (const segment of segments) {
        if (segment.pause) {
          // Handle pause - wait for the specified duration
          await new Promise(resolve => setTimeout(resolve, segment.pause));
        } else if (segment.text) {
          // Add styled text to the result
          result += segment.text;
          setDisplayedText(result);
        }
      }
      
      setIsComplete(true);
    };

    processTextWithCommands();
  }, [message.text, parseText]);

  // Render styled text segments with progressive display
  const renderStyledText = () => {
    let currentLength = 0;
    const segmentsToShow = [];
    
    for (const segment of textSegments) {
      if (segment.pause) continue; // Skip pause segments in rendering
      if (!segment.text) continue;
      
      currentLength += segment.text.length;
      
      // Only show segments that are within the current displayed text length
      if (currentLength <= displayedText.length) {
        segmentsToShow.push(segment);
      } else {
        // For the current segment being displayed, show partial text
        const remainingLength = displayedText.length - (currentLength - segment.text.length);
        if (remainingLength > 0) {
          segmentsToShow.push({
            ...segment,
            text: segment.text.substring(0, remainingLength)
          });
        }
        break;
      }
    }
    
    return segmentsToShow.map((segment, index) => (
      <span key={index} style={segment.style}>
        {segment.text}
      </span>
    ));
  };

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
            {renderStyledText()}
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
            <div>{renderStyledText()}</div>
          </div>
        );
      
      case 'choice':
        return (
          <div style={{ 
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px'
          }}>
            <div style={{ marginBottom: '10px' }}>{renderStyledText()}</div>
            {isComplete && message.choices?.map(choice => (
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
        height: '200px',
        zIndex: 3
      }}
    >
      {renderMessageContent()}
    </div>
  );
};

export default ChatMessage; 