import React, { useEffect } from 'react';
import TheaterCore from './TheaterCore';
import ControlPanel from './ControlPanel';
import ConsolePanel from './ConsolePanel';
import { StoryChapterDB } from '../../services/StoryChapterDB';

const Architecture: React.FC = () => {
  useEffect(() => {
    const initDB = async () => {
      try {
        await StoryChapterDB.getInstance().init();
        console.log('StoryDB initialized successfully in Architecture component');
      } catch (error) {
        console.error('Failed to initialize StoryDB:', error);
      }
    };

    initDB();
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '70%',
        height: '70%'
      }}>
        <TheaterCore />
      </div>
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '30%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ControlPanel />
        <ConsolePanel />
      </div>
    </div>
  );
};

export default Architecture;
