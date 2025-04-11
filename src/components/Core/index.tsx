import React from 'react';
import { Link } from 'react-router-dom';

const Core: React.FC = () => {
  return (
    <div className="core-container">
      <h1 className="component-title">Core Game</h1>
      <div className="component-content">
        <p>This is the main game component.</p>
        <div className="back-link">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Core; 