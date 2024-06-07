import React from 'react';
import './Disk.css';
import apfs from '../../../assets/apfs.svg';
import ntfs from '../../../assets/ntfs.svg'; // Import the NTFS image
import exfat from '../../../assets/exfat.svg'; // Import the exFAT image
import def from '../../../assets/default.svg'; // Import the default image

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
  volumeUsedSpace = "0 GB",
  diskSize = "0 GB",
  onClick,
  isSelected,
}) => {
  const getFileSystemImage = (fileSystem: string) => {
    switch (fileSystem.toLowerCase()) {
      case 'apfs':
        return apfs;
      case 'ntfs':
        return ntfs;
      case 'exfat':
        return exfat;
      // Add more cases for different file systems if needed
      default:
        return def; // Return a default image or path if needed
    }
  };

  const calculateUsagePercentage = (used: string, size: string) => {
    if (!used || !size) return 0;
    const usedValue = parseFloat(used.replace(/[^0-9.]/g, ''));
    const sizeValue = parseFloat(size.replace(/[^0-9.]/g, ''));
    if (isNaN(usedValue) || isNaN(sizeValue)) return 0;
    return (usedValue / sizeValue) * 100;
  };

  const usagePercentage = calculateUsagePercentage(volumeUsedSpace, diskSize);

  return (
    <div className={`disk-container ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="file-system-image-container">
        <img src={getFileSystemImage(fileSystemPersonality)} alt={fileSystemPersonality} className="file-system-image" />
      </div>
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
