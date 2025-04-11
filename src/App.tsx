import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Core from './components/Core';
import Editor from './components/Editor';
import Log from './components/Log';
import Back from './components/Back';
import './App.css';

// Home component that displays the four links
const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">React Core</h1>
      <div className="links-container">
        <Link to="/core" className="link-card">
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
          <Route path="/core" element={<Core />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/log" element={<Log />} />
          <Route path="/back" element={<Back />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;