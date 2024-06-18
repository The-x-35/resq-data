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
}

const RecoverableFiles: React.FC<RecoverableFilesProps> = ({ onRecoverAllFiles }) => {
  const [output, setOutput] = useState<FLSOutput[]>([]);

  useEffect(() => {
    const fetchFLSOutput = async () => {
      try {
        const response = await fetch('http://localhost:5001/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command: 'fls ../../../disk.img' }),
        });
        const data = await response.json();
        const formattedOutput = formatFLSOutput(data.output);
        setOutput(formattedOutput);
      } catch (error) {
        console.error('Error executing command', error);
      }
    };

    fetchFLSOutput();
  }, []);

  const formatFLSOutput = (output: string): FLSOutput[] => {
    const lines = output.split('\n');
    const formattedData = lines.filter(Boolean).map(line => {
      const [fileType, inode, fileName] = line.split(/\s+/);
      return { fileType, inode, fileName };
    });
    return formattedData;
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
