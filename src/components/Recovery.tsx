import React, { useState, useEffect } from 'react';
import './Recovery.css';

interface RecoveryProps {
  recoveryData: string | Array<[string, string, string]>; // Receive recoveryData as a prop
}

const Recovery: React.FC<RecoveryProps> = ({ recoveryData }) => {
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleRecovery = async () => {
      setLoading(true);
      setOutput('');
      try {
        const command = recoveryData === 'recover_all' ? 
          'tsk_recover ../../../disk.img ../../../ResQed_Data/' : 
          `Wip`; // Placeholder for actual command

        const response = await fetch('http://localhost:5001/execute-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command }),
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

    handleRecovery();
  }, [recoveryData]);

  return (
    <div className="recovery">
      <h1>Recovering Files</h1>
      <p>Recovery Data: {Array.isArray(recoveryData) ? recoveryData.map(data => data.join(', ')).join('; ') : recoveryData}</p>
      <div className="output-box">
        {loading ? <p>Loading...</p> : <pre>{output}</pre>}
      </div>
    </div>
  );
};

export default Recovery;
