import React, { useState } from 'react';
import './DiskImage.css';

interface DiskImageProps {
  filesystem: string;
}

const DiskImage: React.FC<DiskImageProps> = ({ filesystem }) => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnmount = async () => {
    try {
      const response = await fetch('http://localhost:5001/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `diskutil unmount ${filesystem}` }),
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
        body: JSON.stringify({ command: `sudo dd if=${filesystem} of=../../../disk.img bs=1024k status=progress` }),
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
      <p>Filesystem: {filesystem}</p>
      <button onClick={handleUnmount}>Unmount Disk</button>
      <button onClick={handleCreateDiskImage} disabled={loading}>Make Disk Image</button>
      <div className="output-box">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default DiskImage;
