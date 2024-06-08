import React, { useState, useEffect } from 'react';
import './DiskImage.css';

interface DiskImageProps {
  deviceNode: string;
  volumeName: string;
  onShowRecoverableFiles: () => void; // New prop to handle showing recoverable files
}

const DiskImage: React.FC<DiskImageProps> = ({ deviceNode, volumeName, onShowRecoverableFiles }) => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Any necessary logic to handle the selected disk
    console.log(`Selected Disk: ${deviceNode}, Volume Name: ${volumeName}`);
  }, [deviceNode, volumeName]);

  const handleUnmount = async () => {
    try {
      const response = await fetch('http://localhost:5001/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `diskutil unmount ${deviceNode}` }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput('Error executing command');
    }
  };

  const handleCreateDiskImage = async () => {
    setOutput('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/execute-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `sudo dd if=${deviceNode} of=../../../disk.img bs=1024k status=progress` }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader?.read()!;
        if (done) break;
        setOutput(decoder.decode(value));
      }
    } catch (error) {
      setOutput('Error executing command');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disk-image">
      <h1>Selected Disk</h1>
      <p>Device Node: {deviceNode}</p>
      <p>Volume Name: {volumeName}</p>
      <button onClick={handleUnmount}>Unmount Disk</button>
      <button onClick={handleCreateDiskImage} disabled={loading}>Make Disk Image</button>
      <button onClick={onShowRecoverableFiles} disabled={loading}>Show Recoverable Files</button>
      <div className="output-box">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default DiskImage;
