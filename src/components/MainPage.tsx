import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SelectDisk from './SelectDisk';
import DiskImage from './DiskImage';
import RecoverableFiles from './RecoverableFiles';
import Recovery from './Recovery';
import './MainPage.css';
import CommandExecutor from './CommandExecutor';

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

  const handleShowRecoverableFiles = () => {
    setSelectedPage(Page.RecoverableFiles); // Navigate to RecoverableFiles page
  };

  const handleRecoverAllFiles = () => {
    setSelectedPage(Page.Recovery); // Navigate to Recovery page
  };

  const renderContent = () => {
    switch (selectedPage) {
      case Page.SelectDisk:
        return <SelectDisk onDiskSelect={handleDiskSelect} />;
      case Page.DiskImage:
        return selectedFilesystem ? (
          <DiskImage filesystem={selectedFilesystem} onShowRecoverableFiles={handleShowRecoverableFiles} />
        ) : (
          <p>Please select a filesystem first.</p>
        );
      case Page.RecoverableFiles:
        return <RecoverableFiles onRecoverAllFiles={handleRecoverAllFiles} />;
      case Page.Recovery:
        return <Recovery />;
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
};

export default MainPage;
