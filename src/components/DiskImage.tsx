import React, { useState } from 'react';
import './DiskImage.css';

interface DiskImageProps {
  filesystem: string;
}

const DiskImage: React.FC<DiskImageProps> = ({ filesystem }) => {
  const [output, setOutput] = useState('');

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

  return (
    <div className="disk-image">
      <h1>Selected Disk</h1>
      <p>Filesystem: {filesystem}</p>
      <button onClick={handleUnmount}>Unmount Disk</button>
      <div className="output-box">
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default DiskImage;
