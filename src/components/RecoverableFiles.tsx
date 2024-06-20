// RecoverableFiles.tsx
import React, { useState, useEffect } from 'react';
import './RecoverableFiles.css';
import FileSystemObject from './ui/FileSystemObject';

interface FLSOutput {
  fileType: string;
  inode: string;
  fileName: string;
}

interface RecoverableFilesProps {
  onRecoverAllFiles: () => void;
  parentInode?: string; // Optional parent inode to fetch directory contents
}

const RecoverableFiles: React.FC<RecoverableFilesProps> = ({ onRecoverAllFiles, parentInode }) => {
  const [output, setOutput] = useState<FLSOutput[]>([]);
  const [command, setCommand] = useState<string>(''); // State to store the command

  const fetchFLSOutput = async (inode?: string) => {
    try {
      const commandInode = inode ? inode.replace(/:$/, '') : ''; // Remove colon from the end of inode
      const newCommand = commandInode ? `fls ../../../disk.img ${commandInode}` : 'fls ../../../disk.img';
      setCommand(newCommand); // Store the command
      const response = await fetch('http://localhost:5001/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: newCommand }),
      });
      const data = await response.json();
      const formattedOutput = formatFLSOutput(data.output);
      setOutput(formattedOutput);
    } catch (error) {
      console.error('Error executing command', error);
    }
  };

  useEffect(() => {
    fetchFLSOutput(parentInode);
  }, [parentInode]);

  const formatFLSOutput = (output: string): FLSOutput[] => {
    const lines = output.split('\n');
    const formattedData = lines.filter(Boolean).map(line => {
      const [fileType, inode, fileName] = line.split(/\s+/);
      return { fileType, inode, fileName };
    });
    return formattedData;
  };

  const handleDoubleClick = (inode: string) => {
    fetchFLSOutput(inode.replace(/:$/, '')); // Refresh the command and output
  };

  return (
    <div className="recoverable-files">
      {output.length > 0 ? (
        <div className="grid-and-button">
          <div className="filesystem-grid">
            {output.map((row, index) => (
              <FileSystemObject
                key={index}
                fileType={row.fileType}
                inode={row.inode}
                fileName={row.fileName}
                onDoubleClick={handleDoubleClick}
              />
            ))}
          </div>
          <button className="recover-button" onClick={onRecoverAllFiles}>
            Recover All Files
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RecoverableFiles;
