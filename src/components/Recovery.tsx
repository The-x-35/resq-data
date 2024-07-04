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
        const buildCommand = async (recoveryData: Array<[string, string, string]>) => {
          let command = 'mkdir -p ../../../ResQed_Data && ';
          for (const [inode, fileName, fileType] of recoveryData) {
            if (fileType === 'r/r') {
              const trimmedInode = inode.replace(/:$/, '');
              const escapedFileName = fileName.replace(/ /g, '\\ ');
              command += `icat ../../../disk.img ${trimmedInode} > ../../../ResQed_Data/${escapedFileName} && `;
            } else {
              command += await handleDirectory(inode, fileName);
            }
          }
          return command.slice(0, -4); // Remove the last ' && ' from the command string
        };

        const handleDirectory = async (inode: string, dirName: string) => {
          let command = `mkdir -p ../../../ResQed_Data/${dirName.replace(/ /g, '\\ ')} && `;
          const trimmedInode = inode.replace(/:$/, '');
          const flsCommand = `fls ../../../disk.img ${trimmedInode}`;
          
          const response = await fetch('http://localhost:5001/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: flsCommand }),
          });

          const data = await response.json();
          const formattedOutput = formatFLSOutput(data.output);

          for (const item of formattedOutput) {
            const [itemInode, itemName, itemType] = [item.inode, item.fileName, item.fileType];
            if (itemType === 'r/r') {
              const escapedItemName = itemName.replace(/ /g, '\\ ');
              command += `icat ../../../disk.img ${itemInode.replace(/:$/, '')} > ../../../ResQed_Data/${dirName.replace(/ /g, '\\ ')}/${escapedItemName} && `;
            } else {
              command += await handleDirectory(itemInode, `${dirName}/${itemName}`);
            }
          }

          return command;
        };

        const formatFLSOutput = (output: string): Array<{ inode: string, fileName: string, fileType: string }> => {
          const lines = output.split('\n');
          return lines.filter(Boolean).map(line => {
            const parts = line.split(/\s+/);
            const fileType = parts[0];
            const hasAsterisk = parts[1] === '*';
            const inode = hasAsterisk ? parts[2] : parts[1];
            const fileName = hasAsterisk ? parts.slice(3).join(' ') : parts.slice(2).join(' ');
            return { fileType, inode, fileName };
          });
        };

        let command = '';
        if (recoveryData === 'recover_all') {
          command = 'tsk_recover ../../../disk.img ../../../ResQed_Data/';
        } else if (Array.isArray(recoveryData)) {
          command = await buildCommand(recoveryData);
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
          const { done, value } = await reader!.read();
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
