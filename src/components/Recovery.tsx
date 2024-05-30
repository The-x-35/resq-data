import React, { useState } from 'react';
import './Recovery.css';

const Recovery: React.FC = () => {
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRecovery = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await fetch('http://localhost:5001/execute-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: 'tsk_recover ../../../disk.img ../../../ResQed_Data/' }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader?.read()!;
        if (done) break;
        setOutput((prevOutput) => prevOutput + decoder.decode(value));
      }
    } catch (error) {
      setOutput('Error executing command');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery">
      <h1>Recovering Files</h1>
      <button className="button" onClick={handleRecovery} disabled={loading}>
        Start Recovery
      </button>
      <div className="output-box">
        {loading ? <p>Loading...</p> : <pre>{output}</pre>}
      </div>
    </div>
  );
};

export default Recovery;
