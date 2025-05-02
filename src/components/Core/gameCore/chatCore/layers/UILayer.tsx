import React, { memo } from 'react';

// Import event handlers and types
import { DialogEvent } from '../utils/DialogEvent';
import RequestSelection from '../execution/RequestSelection';
import { isRequestSelectionEvent, RequestSelectionEvent } from '../execution/RequestSelection';

// Constants for UI styling
const UI_STYLE_CONFIG = {
  COLORS: {
    PRIMARY: '#a67c52',
    PRIMARY_HOVER: '#c89c72',
    PRIMARY_BORDER: '#8c5e2a',
    TEXT_LIGHT: 'white',
    BACKGROUND_DARK: 'rgba(0, 0, 0, 0.9)',
  },
  SPACING: {
    SM: '5px',
    MD: '10px',
    LG: '20px',
  },
  SIZES: {
    CONTROL_BUTTON: '50px',
    ICON_FONT: '20px',
    LABEL_FONT: '10px',
    HISTORY_TEXT: '16px',
  },
  SHADOWS: {
    DEFAULT: '0 4px 6px rgba(0, 0, 0, 0.3)',
    ACTIVE: '0 2px 3px rgba(0, 0, 0, 0.3)',
  },
  TRANSITIONS: {
    DEFAULT: 'all 0.3s ease',
  },
  Z_INDEX: {
    CONTENT: 3,
    CONTROLS: 10,
    HISTORY: 20,
  },
};

// ContentLayer component style
const contentLayerStyle = {
  position: 'relative' as const,
  zIndex: UI_STYLE_CONFIG.Z_INDEX.CONTENT,
  width: '100%',
  height: '100%',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  pointerEvents: 'all' as const,
} as const;

// Control panel style
const controlPanelStyle = {
  position: 'absolute' as const,
  top: UI_STYLE_CONFIG.SPACING.LG,
  right: UI_STYLE_CONFIG.SPACING.LG,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  gap: UI_STYLE_CONFIG.SPACING.MD,
  zIndex: UI_STYLE_CONFIG.Z_INDEX.CONTROLS,
} as const;

// Control button style
const controlButtonStyle = {
  background: UI_STYLE_CONFIG.COLORS.PRIMARY,
  color: UI_STYLE_CONFIG.COLORS.TEXT_LIGHT,
  border: `2px solid ${UI_STYLE_CONFIG.COLORS.PRIMARY_BORDER}`,
  borderRadius: '5px',
  width: UI_STYLE_CONFIG.SIZES.CONTROL_BUTTON,
  height: UI_STYLE_CONFIG.SIZES.CONTROL_BUTTON,
  cursor: 'pointer' as const,
  fontSize: '12px',
  transition: UI_STYLE_CONFIG.TRANSITIONS.DEFAULT,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  boxShadow: UI_STYLE_CONFIG.SHADOWS.DEFAULT,
} as const;

// Button icon style
const buttonIconStyle = {
  fontSize: UI_STYLE_CONFIG.SIZES.ICON_FONT,
  marginBottom: '3px',
} as const;

// Button label style
const buttonLabelStyle = {
  fontSize: UI_STYLE_CONFIG.SIZES.LABEL_FONT,
  textTransform: 'uppercase' as const,
} as const;

// History panel style
const getHistoryPanelStyle = (visible: boolean) => ({
  position: 'absolute' as const,
  top: '10%',
  left: '50%',
  transform: 'translateX(-50%)' as const,
  width: '80%',
  height: '70%',
  background: UI_STYLE_CONFIG.COLORS.BACKGROUND_DARK,
  border: `2px solid ${UI_STYLE_CONFIG.COLORS.PRIMARY}`,
  borderRadius: '10px',
  padding: UI_STYLE_CONFIG.SPACING.LG,
  color: UI_STYLE_CONFIG.COLORS.TEXT_LIGHT,
  zIndex: UI_STYLE_CONFIG.Z_INDEX.HISTORY,
  display: visible ? 'block' : 'none',
  overflowY: 'auto' as const,
});

// History entry style
const historyEntryStyle = {
  marginBottom: UI_STYLE_CONFIG.SPACING.LG,
  paddingBottom: UI_STYLE_CONFIG.SPACING.MD,
  borderBottom: `1px solid ${UI_STYLE_CONFIG.COLORS.PRIMARY}`,
} as const;

// History name style
const historyNameStyle = {
  fontWeight: 'bold' as const,
  color: UI_STYLE_CONFIG.COLORS.PRIMARY,
  marginBottom: UI_STYLE_CONFIG.SPACING.SM,
} as const;

// History text style
const historyTextStyle = {
  fontSize: UI_STYLE_CONFIG.SIZES.HISTORY_TEXT,
  lineHeight: '1.4',
} as const;

// History header style
const historyHeaderStyle = {
  color: UI_STYLE_CONFIG.COLORS.PRIMARY,
  marginBottom: UI_STYLE_CONFIG.SPACING.LG,
  textAlign: 'center' as const,
} as const;

interface UILayerProps {
  currentEvent: DialogEvent | null;
  messageHistory: DialogEvent[];
  showHistory: boolean;
  handleContentClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleSaveClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleLoadClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleConfigClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleHistoryClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSelection: (value: string) => void;
  commandExecution: React.ReactNode;
}

/**
 * UILayer component
 * 
 * Responsible for handling all UI elements (dialogs, buttons, selections)
 * Controlled by the ScriptExecutor
 * Completely isolated from background and character layers
 */
const UILayer: React.FC<UILayerProps> = ({
  currentEvent,
  messageHistory,
  showHistory,
  handleContentClick,
  handleSaveClick,
  handleLoadClick,
  handleConfigClick,
  handleHistoryClick,
  handleSelection,
  commandExecution
}) => {
  console.log('UILayer rendered with current event:', currentEvent?.eventCommand);
  
  return (
    <div style={contentLayerStyle} onClick={handleContentClick}>
      {commandExecution}

      <div style={controlPanelStyle} className="ui-element">
        <button 
          style={controlButtonStyle}
          className="ui-element"
          onClick={handleSaveClick}
        >
          <div style={buttonIconStyle}>💾</div>
          <div style={buttonLabelStyle}>Save</div>
        </button>
        <button 
          style={controlButtonStyle}
          className="ui-element"
          onClick={handleLoadClick}
        >
          <div style={buttonIconStyle}>📂</div>
          <div style={buttonLabelStyle}>Load</div>
        </button>
        <button 
          style={controlButtonStyle}
          className="ui-element"
          onClick={handleConfigClick}
        >
          <div style={buttonIconStyle}>⚙️</div>
          <div style={buttonLabelStyle}>Config</div>
        </button>
        <button 
          style={controlButtonStyle}
          className="ui-element"
          onClick={handleHistoryClick}
        >
          <div style={buttonIconStyle}>📜</div>
          <div style={buttonLabelStyle}>Logs</div>
        </button>
      </div>

      {/* History panel */}
      <div 
        style={getHistoryPanelStyle(showHistory)} 
        className="ui-element"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <h2 style={historyHeaderStyle}>
          Message History
        </h2>
        {messageHistory.map((event, index) => (
          <div key={index} style={historyEntryStyle}>
            {event.unitRes && <div style={historyNameStyle}>{event.unitRes}</div>}
            <div style={historyTextStyle}>{event.message}</div>
          </div>
        ))}
      </div>

      {currentEvent && isRequestSelectionEvent(currentEvent) && (
        <RequestSelection
          event={currentEvent as RequestSelectionEvent}
          onSelect={handleSelection}
        />
      )}
    </div>
  );
};

export default memo(UILayer); 