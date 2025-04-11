import React from 'react';
import { Link } from 'react-router-dom';

const Editor: React.FC = () => {
  return (
    <div className="editor-container">
      <h1 className="component-title">Map Editor</h1>
      <div className="component-content">
        <p>This is the map editor tool component.</p>
        <div className="back-link">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Editor; 