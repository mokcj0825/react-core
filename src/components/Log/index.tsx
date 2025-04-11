import React from 'react';
import { Link } from 'react-router-dom';

const Log: React.FC = () => {
  return (
    <div className="log-container">
      <h1 className="component-title">Log Editor</h1>
      <div className="component-content">
        <p>This is the log editor component.</p>
        <div className="back-link">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Log; 