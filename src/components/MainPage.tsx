import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SelectDisk from './SelectDisk';
import DiskImage from './DiskImage';
import './MainPage.css';

export enum Page {
  SelectDisk,
  DiskImage,
  RecoverableFiles,
  Recovery,
}

const MainPage: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.SelectDisk);
  const [selectedFilesystem, setSelectedFilesystem] = useState<string | null>(null);

  const handleDiskSelect = (filesystem: string) => {
    setSelectedFilesystem(filesystem);
    setSelectedPage(Page.DiskImage); // Automatically navigate to DiskImage after selecting a disk
  };

  const renderContent = () => {
    switch (selectedPage) {
      case Page.SelectDisk:
        return <SelectDisk onDiskSelect={handleDiskSelect} />;
      case Page.DiskImage:
        return selectedFilesystem ? (
          <DiskImage filesystem={selectedFilesystem} />
        ) : (
          <p>Please select a filesystem first.</p>
        );
      case Page.RecoverableFiles:
        return <p>Recoverable Files Component Placeholder</p>;
      case Page.Recovery:
        return <p>Recovery Component Placeholder</p>;
      default:
        return <SelectDisk onDiskSelect={handleDiskSelect} />;
    }
  };

  return (
    <div className="page">
      <Sidebar onSelectPage={setSelectedPage} selectedPage={selectedPage} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default MainPage;
