import React, { useState, useEffect } from 'react';
import './RecoverableFiles.css';
import FileSystemObject from './ui/FileSystemObject';
import backIcon from '../../assets/back.svg';
import EyeToggle from '../components/ui/EyeToggle'; // Import the EyeToggle component

interface FLSOutput {
  fileType: string;
  inode: string;
  fileName: string;
  hasAsterisk: boolean;
}

interface RecoverableFilesProps {
  onRecoverAllFiles: (selectedData: Array<[string, string, string]> | 'recover_all') => void; // Pass selected data or "recover_all" to the recovery function
  parentInode?: string; // Optional parent inode to fetch directory contents
}

const RecoverableFiles: React.FC<RecoverableFilesProps> = ({ onRecoverAllFiles, parentInode }) => {
  const [output, setOutput] = useState<FLSOutput[]>([]);
  const [command, setCommand] = useState<string>(''); // State to store the command
  const [history, setHistory] = useState<{ command: string, output: FLSOutput[] }[]>([]); // State to store the history
  const [showAllFiles, setShowAllFiles] = useState<boolean>(false); // State to toggle showing all files
  const [selectedInodes, setSelectedInodes] = useState<Set<string>>(new Set()); // State to store selected inodes
  const [isSelectAllChecked, setIsSelectAllChecked] = useState<boolean>(false); // State to track "select all" checkbox

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
      setHistory(prevHistory => [...prevHistory, { command: newCommand, output: formattedOutput }]); // Update history
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
      const parts = line.split(/\s+/);
      const fileType = parts[0];
      const hasAsterisk = parts[1] === '*';
      const inode = hasAsterisk ? parts[2] : parts[1];
      const fileName = hasAsterisk ? parts.slice(3).join(' ') : parts.slice(2).join(' ');
      return { fileType, inode, fileName, hasAsterisk };
    });
    return formattedData;
  };

  const handleDoubleClick = (inode: string) => {
    fetchFLSOutput(inode.replace(/:$/, '')); // Refresh the command and output
  };

  const handleBack = () => {
    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      newHistory.pop(); // Remove the last command from the history
      const lastState = newHistory[newHistory.length - 1]; // Get the last state from the history
      if (lastState) {
        setCommand(lastState.command);
        setOutput(lastState.output);
      } else {
        fetchFLSOutput(parentInode); // If no history left, fetch the original parent inode
      }
      return newHistory;
    });
  };

  const handleToggleChange = (isChecked: boolean) => {
    setShowAllFiles(isChecked);
  };

  const handleSelectionChange = (inode: string) => {
    setSelectedInodes(prevSelectedInodes => {
      const newSelectedInodes = new Set(prevSelectedInodes);
      if (newSelectedInodes.has(inode)) {
        newSelectedInodes.delete(inode);
      } else {
        newSelectedInodes.add(inode);
      }
      setIsSelectAllChecked(newSelectedInodes.size === output.length); // Update "select all" checkbox state
      return newSelectedInodes;
    });
  };

  const handleSelectAll = (isChecked: boolean) => {
    setIsSelectAllChecked(isChecked);
    if (isChecked) {
      const allInodes = output.map(row => row.inode);
      setSelectedInodes(new Set(allInodes));
    } else {
      setSelectedInodes(new Set());
    }
  };

  const handleRecover = () => {
    if (isSelectAllChecked) {
      onRecoverAllFiles('recover_all');
    } else {
      const selectedData = Array.from(selectedInodes).map(inode => {
        const selectedFile = output.find(file => file.inode === inode);
        return [selectedFile?.inode, selectedFile?.fileName, selectedFile?.fileType];
      }) as Array<[string, string, string]>;
      onRecoverAllFiles(selectedData);
    }
  };

  return (
    <div className="recoverable-files">
      <div className="navigation-bar">
        {history.length > 1 && (
          <button className="back-button" onClick={handleBack}>
            <img src={backIcon} alt="Back" className="back-icon" />
            <span>Back</span>
          </button>
        )}
        <div className="toggle-div">
          <span>Show all files</span>
          <EyeToggle onChange={handleToggleChange} />
        </div>
      </div>
      {output.length > 0 ? (
        <div className="grid-and-button">
          <div className="select-all-div">
            <input
              type="checkbox"
              id="select-all"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={isSelectAllChecked}
            />
            <label htmlFor="select-all">Select all</label>
          </div>
          <div className="filesystem-grid">
            {output.map((row, index) => (
              (!showAllFiles && row.hasAsterisk) || showAllFiles ? (
                <FileSystemObject
                  key={index}
                  fileType={row.fileType}
                  inode={row.inode}
                  fileName={row.fileName}
                  hasAsterisk={row.hasAsterisk} // Pass the asterisk flag to the FileSystemObject component
                  onDoubleClick={handleDoubleClick}
                  isSelected={selectedInodes.has(row.inode)}
                  onSelectionChange={handleSelectionChange}
                />
              ) : null
            ))}
          </div>
          <button className="recover-button" onClick={handleRecover}>
            Recover
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RecoverableFiles;
