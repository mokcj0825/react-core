import React, { useState } from 'react';
import { EventCommand } from '../EventCommand';

interface SelectionOption {
    label: string;
    value: string;
    nextScriptId?: string;
}

export interface RequestSelectionEvent {
    eventCommand: EventCommand.REQUEST_SELECTION;
    option: SelectionOption[];
    storageKey: string;
    valueType?: 'STRING' | 'NUMBER' | 'BOOLEAN';
    actionToStorage?: 'SET' | 'APPEND' | 'REMOVE';
    message?: string;
    characterName?: string;
}

export const isRequestSelectionEvent = (event: any): event is RequestSelectionEvent => {
    return event?.eventCommand === EventCommand.REQUEST_SELECTION;
};

interface Props {
    event: RequestSelectionEvent;
    onSelect: (value: string) => void;
}

const RequestSelection: React.FC<Props> = ({ event, onSelect }) => {
    if (!isRequestSelectionEvent(event)) {
        return null;
    }

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleSelection = (option: SelectionOption) => {
        const { value } = option;
        console.log('RequestSelection: Selection made:', option);
        
        // Process the value based on valueType
        let processedValue = value;
        if (event.valueType === 'NUMBER') {
            processedValue = value.toString();
        } else if (event.valueType === 'BOOLEAN') {
            processedValue = value.toString();
        }
        
        // Determine the action to take based on actionToStorage
        const action = event.actionToStorage || 'SET';
        
        // Handle storage based on action
        switch (action) {
            case 'SET':
                localStorage.setItem(event.storageKey, processedValue);
                console.log(`RequestSelection: Stored "${processedValue}" in localStorage key "${event.storageKey}"`);
                break;
            case 'APPEND':
                const existingValue = localStorage.getItem(event.storageKey) || '';
                localStorage.setItem(event.storageKey, existingValue + ',' + processedValue);
                console.log(`RequestSelection: Appended "${processedValue}" to localStorage key "${event.storageKey}"`);
                break;
            case 'REMOVE':
                const currentValue = localStorage.getItem(event.storageKey) || '';
                const values = currentValue.split(',').filter(v => v !== processedValue);
                localStorage.setItem(event.storageKey, values.join(','));
                console.log(`RequestSelection: Removed "${processedValue}" from localStorage key "${event.storageKey}"`);
                break;
            default:
                localStorage.setItem(event.storageKey, processedValue);
                console.log(`RequestSelection: Default action - stored "${processedValue}" in localStorage key "${event.storageKey}"`);
        }
        
        // If there's a nextScriptId in the option, store it in a temporary storage location
        // This can be used for direct script navigation if needed
        if (option.nextScriptId) {
            localStorage.setItem(`${event.storageKey}_nextScriptId`, option.nextScriptId);
            console.log(`RequestSelection: Stored nextScriptId "${option.nextScriptId}" in localStorage`);
        }
        
        // Call the parent's onSelect callback
        onSelect(value);
    };

    const getButtonStyle = (index: number): React.CSSProperties => {
        const style: React.CSSProperties = {...OptionButton};
        
        if (hoveredIndex === index) {
            style.background = '#c89c72';
            style.transform = 'translateY(-2px)';
        }
        
        if (activeIndex === index) {
            style.transform = 'translateY(1px)';
        }
        
        return style;
    };

    return (
        <div style={SelectionContainer}>
            <div style={OptionList}>
                {event.option.map((option, index) => (
                    <button
                        key={index}
                        style={getButtonStyle(index)}
                        onClick={() => handleSelection(option)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onMouseDown={() => setActiveIndex(index)}
                        onMouseUp={() => setActiveIndex(null)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const SelectionContainer = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    maxWidth: '600px',
    background: 'rgba(0, 0, 0, 0.9)',
    border: '2px solid #a67c52',
    borderRadius: '10px',
    padding: 20,
    zIndex: 10,
} as const;

const OptionList = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
} as const;

const OptionButton = {
    background: '#a67c52',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '15px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
} as React.CSSProperties;

export default RequestSelection; 