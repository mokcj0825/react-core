import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Core from './components/Core';
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

// Editor with stage selection
const EditorWithStage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSaveToStage = (stageId: string) => {
    // Navigate to the editor with the stage ID
    navigate(`/editor/${stageId}`);
  };
  
  return (
    <div className="editor-stage-container">
      <h2>Select a stage to edit</h2>
      <div className="stage-buttons">
        <button onClick={() => handleSaveToStage('0001')}>Stage 0001</button>
        <button onClick={() => handleSaveToStage('0002')}>Stage 0002</button>
        <button onClick={() => handleSaveToStage('0003')}>Stage 0003</button>
        <button onClick={() => handleSaveToStage('custom')}>Custom Stage</button>
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
          <Route path="/core/:stageId" element={<Core />} />
          <Route path="/editor" element={<EditorWithStage />} />
          <Route path="/log" element={<Log />} />
          <Route path="/back" element={<Back />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;