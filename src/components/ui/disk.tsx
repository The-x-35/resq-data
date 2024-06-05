import React from 'react';
import './Disk.css';

interface DiskProps {
  deviceNode: string;
  volumeName: string;
  mounted: string;
  fileSystemPersonality: string;
  volumeUsedSpace: string;
  diskSize: string;
  onClick: () => void;
  isSelected: boolean;
}

const Disk: React.FC<DiskProps> = ({
  deviceNode,
  volumeName,
  mounted,
  fileSystemPersonality,
  volumeUsedSpace,
  diskSize,
  onClick,
  isSelected,
}) => {
  const getFileSystemImage = (fileSystem: string) => {
    switch (fileSystem.toLowerCase()) {
      case 'apfs':
        return 'apfs.png';
      case 'ntfs':
        return 'ntfs.png';
      // Add more cases for different file systems if needed
      default:
        return 'default.png';
    }
  };

  const calculateUsagePercentage = (used: string, size: string) => {
    const usedValue = parseFloat(used.replace(/[^0-9.]/g, ''));
    const sizeValue = parseFloat(size.replace(/[^0-9.]/g, ''));
    return (usedValue / sizeValue) * 100;
  };

  const usagePercentage = calculateUsagePercentage(volumeUsedSpace, diskSize);

  return (
    <div className={`disk-container ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <img src={getFileSystemImage(fileSystemPersonality)} alt={fileSystemPersonality} className="file-system-image" />
      <div className="disk-details">
        <div className="volume-name">{volumeName}</div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${usagePercentage}%` }}></div>
        </div>
        <div className="mounted-info">Mounted: {mounted}</div>
      </div>
    </div>
  );
};

export default Disk;
