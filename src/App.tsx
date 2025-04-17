import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Core from './components/Core';
import Battlefield from './components/Core/Battlefield';
import Deployment from './components/Core/Deployment';
import Editor from './components/Editor/index';
import Log from './components/Log';
import Back from './components/Back';
import './App.css';

// Home component that displays the four links
const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">React Core</h1>
      <div className="links-container">
        <Link to="/core/deploy/0002" className="link-card">
          <div className="card-icon">🎮</div>
          <h2>Core</h2>
          <p>Main game component</p>
        </Link>
        <Link to="/editor" className="link-card">
          <div className="card-icon">🗺️</div>
          <h2>Editor</h2>
          <p>Map editor tool</p>
        </Link>
        <Link to="/log" className="link-card">
          <div className="card-icon">📝</div>
          <h2>Log</h2>
          <p>Log editor</p>
        </Link>
        <Link to="/back" className="link-card">
          <div className="card-icon">↩️</div>
          <h2>Back</h2>
          <p>Return to me-in-react.web.app</p>
        </Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/core" element={<Core />}>
            <Route path="battlefield/:stageId" element={<Battlefield />} />
            <Route path="deploy/:stageId" element={<Deployment />} />
            <Route path="battlefield" element={<Navigate to="battlefield/0001" replace />} />
            <Route path="deploy" element={<Navigate to="deploy/0001" replace />} />
            <Route path="" element={<Navigate to="battlefield/0001" replace />} />
          </Route>
          <Route path="/editor" element={<Editor />} />
          <Route path="/log" element={<Log />} />
          <Route path="/back" element={<Back />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;