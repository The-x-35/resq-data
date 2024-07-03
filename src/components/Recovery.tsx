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
        let command = '';
        if (recoveryData === 'recover_all') {
          command = 'tsk_recover ../../../disk.img ../../../ResQed_Data/';
        } else if (Array.isArray(recoveryData)) {
          command = 'mkdir -p ../../../ResQed_Data && ';
          for (const [inode, fileName, fileType] of recoveryData) {
            if (fileType === 'r/r') {
              const trimmedInode = inode.replace(/:$/, '');
              const escapedFileName = fileName.replace(/ /g, '\\ ');
              command += `icat ../../../disk.img ${trimmedInode} > ../../../ResQed_Data/${escapedFileName} && `;
            }
          }
          command = command.slice(0, -4); // Remove the last ' && ' from the command string
        }

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
