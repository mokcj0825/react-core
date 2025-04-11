import React from 'react';
import { Link } from 'react-router-dom';

const Back: React.FC = () => {
  const handleRedirect = () => {
    window.location.href = 'https://me-in-react.web.app';
  };

  return (
    <div className="back-container">
      <h1 className="component-title">Redirect</h1>
      <div className="component-content">
        <p>You are about to be redirected to me-in-react.web.app</p>
        <div className="button-container">
          <button onClick={handleRedirect} className="redirect-button">
            Go to me-in-react.web.app
          </button>
          <div className="back-link">
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Back; 