import React from 'react';

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
  return (
    <tr onClick={onClick} className={isSelected ? 'selected' : ''}>
      <td>{deviceNode}</td>
      <td>{volumeName}</td>
      <td>{mounted}</td>
      <td>{fileSystemPersonality}</td>
      <td>{volumeUsedSpace}</td>
      <td>{diskSize}</td>
    </tr>
  );
};

export default Disk;
