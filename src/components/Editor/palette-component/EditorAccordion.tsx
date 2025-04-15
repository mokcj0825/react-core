import React, { useState } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const EditorAccordion: React.FC<Props> = ({
                                            title,
                                            children,
                                            defaultOpen = true,
                                          }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={wrapperStyle}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...headerBaseStyle,
          borderBottom: isOpen ? '1px solid #eee' : 'none',
        }}
      >
        <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>{title}</h3>
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          fontSize: '18px',
        }}>
          ▼
        </span>
      </div>
      {isOpen && (
        <div style={{ padding: '16px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default EditorAccordion;
const wrapperStyle = {
  marginBottom: '16px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  overflow: 'hidden',
} as const;

const headerBaseStyle = {
  padding: '12px 16px',
  backgroundColor: '#f5f5f5',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
} as const;
