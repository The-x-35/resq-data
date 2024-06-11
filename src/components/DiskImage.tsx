import React, { useState, useEffect } from 'react';
import './DiskImage.css';
import tick from '../../assets/tick.svg'; // Ensure this path is correct and the file exists

interface DiskImageProps {
  deviceNode: string;
  volumeName: string;
  onShowRecoverableFiles: () => void;
}

const DiskImage: React.FC<DiskImageProps> = ({ deviceNode, volumeName, onShowRecoverableFiles }) => {
  const [output, setOutput] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    console.log(`Selected Disk: ${deviceNode}, Volume Name: ${volumeName}`);
  }, [deviceNode, volumeName]);

  const handleUnmount = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `diskutil unmount ${deviceNode}` }),
      });
      const data = await response.json();
      setOutput((prev) => [data.output, prev[1], prev[2]]);
      setCurrentStep([1, currentStep[1], currentStep[2]]);
    } catch (error) {
      setOutput((prev) => ['Error executing command', prev[1], prev[2]]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiskImage = async () => {
    setOutput((prev) => [prev[0], '', prev[2]]);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/execute-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: `sudo dd if=${deviceNode} of=../../../disk.img bs=1024k status=progress` }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => [prev[0], prev[1] + decoder.decode(value), prev[2]]);
      }
      setCurrentStep([currentStep[0], 1, currentStep[2]]);
    } catch (error) {
      setOutput((prev) => [prev[0], 'Error executing command', prev[2]]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowRecoverableFiles = () => {
    onShowRecoverableFiles();
    setCurrentStep([currentStep[0], currentStep[1], 1]);
  };

  return (
    <div className="di-disk-image">
      <div className="di-header">
        <h1>Selected Disk</h1>
        <p>Selected Drive: {volumeName} ({deviceNode})</p>
      </div>
      <div className="di-content-container">
        <div className="di-step-container">
          <div className="di-circle-container">
            <div className={`di-circle ${currentStep[0] ? 'di-completed' : ''}`}>
              {currentStep[0] ? <img src={tick} alt="Tick" /> : <span className="di-step-number">1</span>}
            </div>
            <button onClick={handleUnmount} disabled={loading}>Unmount Disk</button>
          </div>
          <div className="di-output-box">
            <pre>{output[0]}</pre>
          </div>
        </div>
        <div className="di-step-container">
          <div className="di-circle-container">
            <div className={`di-circle ${currentStep[1] ? 'di-completed' : ''}`}>
              {currentStep[1] ? <img src={tick} alt="Tick" /> : <span className="di-step-number">2</span>}
            </div>
            <button onClick={handleCreateDiskImage} disabled={loading}>Make Disk Image</button>
          </div>
          <div className="di-output-box">
            <pre>{output[1]}</pre>
          </div>
        </div>
        <div className="di-step-container">
          <div className="di-circle-container">
            <div className={`di-circle ${currentStep[2] ? 'di-completed' : ''}`}>
              {currentStep[2] ? <img src={tick} alt="Tick" /> : <span className="di-step-number">3</span>}
            </div>
            <button onClick={handleShowRecoverableFiles} disabled={loading}>Show Recoverable Files</button>
          </div>
          <div className="di-output-box">
            <pre>{output[2]}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiskImage;
