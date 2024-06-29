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
  hasAsterisk: boolean; // Add the hasAsterisk prop
  isSelected: boolean;
  onSelectionChange: (inode: string) => void;
}

const FileSystemObject: React.FC<FileSystemObjectProps> = ({ fileType, inode, fileName, onDoubleClick, hasAsterisk, isSelected, onSelectionChange }) => {
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
    <div
      className={`filesystem-object ${hasAsterisk ? 'has-asterisk' : ''} ${isSelected ? 'selected' : ''}`}
      title={`Inode: ${inode}`}
      onDoubleClick={() => fileType !== 'r/r' && onDoubleClick(inode)}
      onClick={() => onSelectionChange(inode)}
    >
      <input
        type="checkbox"
        className="selection-checkbox"
        checked={isSelected}
        onChange={() => onSelectionChange(inode)}
      />
      <img src={getIcon()} alt={fileType} className="filesystem-object-icon" />
      <p className="filesystem-object-name">{fileName}</p>
    </div>
  );
};

export default FileSystemObject;
