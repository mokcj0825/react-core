import React, { useState, useEffect } from 'react';
import { useTheater } from '../TheaterCore';

const Town: React.FC = () => {
  const { sceneResource, dispatchSceneCommand } = useTheater();
  const [scriptData, setScriptData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [renderCompleted, setRenderCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!sceneResource) {
      setLoading(false);
      return;
    }

    const fetchScriptData = async () => {
      try {
        setLoading(true);
        const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
        const response = await fetch(`/architecture/${selectedTestCase}/${sceneResource}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch script: ${response.status}`);
        }
        const data = await response.json();
        setScriptData(data);
        setLoading(false);
      } catch (err) {
        console.log('Error fetching script:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchScriptData();
  }, [sceneResource]);

  // Handle render completion
  useEffect(() => {
    if (!loading && !error && scriptData && !renderCompleted) {
      setRenderCompleted(true);
      
      // Execute onRenderCompleted commands if they exist
      if (scriptData.onRenderCompleted && Array.isArray(scriptData.onRenderCompleted)) {
        scriptData.onRenderCompleted.forEach(async (command: any) => {
          switch (command.command) {
            case 'RUN_SCRIPT':
              try {
                const selectedTestCase = localStorage.getItem('selectedTestCase') || 'test-case-001';
                const scriptModule = await import(`/architecture/${selectedTestCase}/${command.srcScript}.ts`);
                if (scriptModule[command.entryPoint]) {
                  scriptModule[command.entryPoint]();
                } else {
                  console.error(`Entry point '${command.entryPoint}' not found in script '${command.srcScript}'`);
                }
              } catch (err) {
                console.error('Error executing script:', err);
              }
              break;
          }
          dispatchSceneCommand(command);
        });
      }
    }
  }, [loading, error, scriptData, renderCompleted, dispatchSceneCommand]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      border: '2px dashed #34A853',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(52, 168, 83, 0.1)'
    }}>
      <div style={{ 
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '4px',
        width: '80%',
        maxHeight: '80%',
        overflow: 'auto'
      }}>
        {loading && <div>Loading script...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && scriptData && (
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            {JSON.stringify(scriptData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Town;