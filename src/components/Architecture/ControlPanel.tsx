import React, { useState, useEffect } from 'react';

const TEST_CASES = [
  { id: 'test-case-001', label: 'Test Case 001' },
  { id: 'test-case-002', label: 'Test Case 002' }
];

const ControlPanel: React.FC = () => {
  const [selectedTestCase, setSelectedTestCase] = useState('test-case-001');

  useEffect(() => {
    localStorage.setItem('selectedTestCase', selectedTestCase);
  }, [selectedTestCase]);

  const handleTestCaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTestCase(event.target.value);
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px',
          fontWeight: 'bold'
        }}>
          Test Case:
        </label>
        <select
          value={selectedTestCase}
          onChange={handleTestCaseChange}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          {TEST_CASES.map(testCase => (
            <option key={testCase.id} value={testCase.id}>
              {testCase.label}
            </option>
          ))}
        </select>
        <div style={{ 
          marginTop: '8px',
          fontSize: '0.9em',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Currently running: {TEST_CASES.find(tc => tc.id === selectedTestCase)?.label}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel; 