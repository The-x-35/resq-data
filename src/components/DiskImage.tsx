import React from 'react';
import './DiskImage.css';

interface DiskImageProps {
  filesystem: string;
}

const DiskImage: React.FC<DiskImageProps> = ({ filesystem }) => {
  return (
    <div className="disk-image">
      <h1>Selected Disk</h1>
      <p>Filesystem: {filesystem}</p>
    </div>
  );
}

export default DiskImage;
