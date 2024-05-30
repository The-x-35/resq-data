import React, { useState, useEffect } from 'react';
import './RecoverableFiles.css';

interface FLSOutput {
  inode: string;
  fileType: string;
  fileName: string;
}

interface RecoverableFilesProps {
  onRecoverAllFiles: () => void; // Add a prop for handling navigation
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
      const [inode, fileType, fileName] = line.split(/\s+/);
      return { inode, fileType, fileName };
    });
    return formattedData;
  };

  return (
    <div className="recoverable-files">
      {output.length > 0 ? (
        <div className="table-and-button">
          <table className="output-table">
            <thead>
              <tr>
                <th>Inode</th>
                <th>Type</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {output.map((row, index) => (
                <tr key={index}>
                  <td>{row.inode}</td>
                  <td>{row.fileType}</td>
                  <td>{row.fileName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="button" onClick={onRecoverAllFiles}>
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
