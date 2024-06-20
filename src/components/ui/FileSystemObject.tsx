// FileSystemObject.tsx
import React from 'react';
import './FileSystemObject.css';
import folderIcon from '../../../assets/folder.png'; // Ensure the path is correct
import fileIcon from '../../../assets/file.png'; // Ensure the path is correct

interface FileSystemObjectProps {
  fileType: string;
  inode: string;
  fileName: string;
  onDoubleClick: (inode: string) => void;
}

const FileSystemObject: React.FC<FileSystemObjectProps> = ({ fileType, inode, fileName, onDoubleClick }) => {
  const getIcon = () => {
    switch (fileType) {
      case 'd/d':
        return folderIcon;
      case 'r/r':
        return fileIcon;
      default:
        return folderIcon; // Default icon for unknown types
    }
  };

  return (
    <div className="filesystem-object" title={`Inode: ${inode}`} onDoubleClick={() => (fileType != 'r/r') && onDoubleClick(inode)}>
      <img src={getIcon()} alt={fileType} className="filesystem-object-icon" />
      <p className="filesystem-object-name">{fileName}</p>
    </div>
  );
};

export default FileSystemObject;
