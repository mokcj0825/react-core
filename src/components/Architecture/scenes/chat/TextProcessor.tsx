import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface TextProcessorProps {
  text: string;
  onComplete?: () => void;
  speed?: number; // Characters per second
}

interface TextSegment {
  text: string;
  style: React.CSSProperties;
  pause?: number;
}

const TextProcessor: React.FC<TextProcessorProps> = ({ 
  text, 
  onComplete, 
  speed = 30 // Default 30 characters per second
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Parse text into segments with formatting commands
  const parseText = useCallback((rawText: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    let currentText = '';
    let currentStyle: React.CSSProperties = {};
    
    // Regular expression to match formatting commands
    const commandRegex = /\{([^}]+)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = commandRegex.exec(rawText)) !== null) {
      // Add text before the command
      if (match.index > lastIndex) {
        const textBefore = rawText.slice(lastIndex, match.index);
        if (textBefore) {
          currentText += textBefore;
        }
      }

      const command = match[1];
      
      // Handle different commands
      if (command.startsWith('PAUSE(')) {
        // Extract pause duration
        const pauseMatch = command.match(/PAUSE\((\d+)\)/);
        if (pauseMatch) {
          const pauseDuration = parseInt(pauseMatch[1]);
          
          // Add current text as a segment
          if (currentText) {
            segments.push({
              text: currentText,
              style: { ...currentStyle }
            });
            currentText = '';
          }
          
          // Add pause segment
          segments.push({
            text: '',
            style: { ...currentStyle },
            pause: pauseDuration
          });
        }
      } else if (command.startsWith('STYLE(')) {
        // Handle style commands
        if (command.includes('BOLD')) {
          currentStyle.fontWeight = 'bold';
        }
        if (command.includes('SIZE(')) {
          const sizeMatch = command.match(/SIZE\('([^']+)'\)/);
          if (sizeMatch) {
            const size = sizeMatch[1];
            switch (size) {
              case 'LARGE':
                currentStyle.fontSize = '1.5em';
                break;
              case 'SMALL':
                currentStyle.fontSize = '0.8em';
                break;
            }
          }
        }
      } else if (command.startsWith('FONT_COLOR(')) {
        // Handle font color
        const colorMatch = command.match(/FONT_COLOR\('([^']+)'\)/);
        if (colorMatch) {
          currentStyle.color = `#${colorMatch[1]}`;
        }
      } else if (command.startsWith('TO(')) {
        // Handle TO command (target text)
        const toMatch = command.match(/TO\('([^']+)'\)/);
        if (toMatch) {
          currentText += toMatch[1];
        }
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < rawText.length) {
      currentText += rawText.slice(lastIndex);
    }

    if (currentText) {
      segments.push({
        text: currentText,
        style: { ...currentStyle }
      });
    }

    return segments;
  }, []);

  const segments = useMemo(() => parseText(text), [text, parseText]);

  // Animation effect
  useEffect(() => {
    if (isComplete || isPaused) return;

    const currentSegment = segments[currentIndex];
    if (!currentSegment) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Handle pause
    if (currentSegment.pause) {
      setIsPaused(true);
      const timer = setTimeout(() => {
        setIsPaused(false);
        setCurrentIndex(prev => prev + 1);
        setDisplayedText('');
      }, currentSegment.pause);
      return () => clearTimeout(timer);
    }

    // Handle text animation
    if (currentSegment.text) {
      const charDelay = 1000 / speed; // Convert speed to milliseconds per character
      let charIndex = 0;

      const interval = setInterval(() => {
        if (charIndex < currentSegment.text.length) {
          setDisplayedText(prev => prev + currentSegment.text[charIndex]);
          charIndex++;
        } else {
          clearInterval(interval);
          setCurrentIndex(prev => prev + 1);
          setDisplayedText('');
        }
      }, charDelay);

      return () => clearInterval(interval);
    }
  }, [segments, currentIndex, isPaused, isComplete, speed, onComplete]);

  // Render the current segment with its style
  const currentSegment = segments[currentIndex];
  if (!currentSegment) return null;

  return (
    <span style={currentSegment.style}>
      {displayedText}
    </span>
  );
};

export default TextProcessor; 