import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SelectDisk from './SelectDisk';
import DiskImage from './DiskImage';
import RecoverableFiles from './RecoverableFiles';
import Recovery from './Recovery';
import HowToUse from './HowToUse';
import DevelopersGuide from './DevelopersGuide';
import './MainPage.css';
import CommandExecutor from './CommandExecutor';
import TL from './ee/tl';

export enum Page {
  SelectDisk,
  DiskImage,
  RecoverableFiles,
  Recovery,
  HowToUse,
  DevelopersGuide,
}

interface CheatCodes {
  [key: string]: JSX.Element;
}

const cheatCodes: CheatCodes = {
  tl: <TL />,
  arpit: <TL />,
};

const MainPage: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.SelectDisk);
  const [selectedDisk, setSelectedDisk] = useState<{ deviceNode: string, volumeName: string } | null>(null);
  const [input, setInput] = useState<string>(''); // State to track cheat code input
  const [easterEggComponent, setEasterEggComponent] = useState<React.ReactNode | null>(null); // State to show Easter egg component
  const [recoveryData, setRecoveryData] = useState<string | Array<[string, string, string]>>(''); // State to store recovery data

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      setInput((prev) => (prev + event.key).slice(-Math.max(...Object.keys(cheatCodes).map(code => code.length)))); // Track the last N characters
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const matchedCheatCode = Object.keys(cheatCodes).find(code => input.includes(code));
    if (matchedCheatCode) {
      setEasterEggComponent(cheatCodes[matchedCheatCode]);
    }
  }, [input]);

  const handleDiskSelect = (deviceNode: string, volumeName: string) => {
    setSelectedDisk({ deviceNode, volumeName });
    setSelectedPage(Page.DiskImage); // Automatically navigate to DiskImage after selecting a disk
  };

  const handleShowRecoverableFiles = () => {
    setSelectedPage(Page.RecoverableFiles); // Navigate to RecoverableFiles page
  };

  const handleRecoverAllFiles = (selectedData: Array<[string, string, string]> | 'recover_all') => {
    setRecoveryData(selectedData);
    setSelectedPage(Page.Recovery); // Navigate to Recovery page
  };

  const renderContent = () => {
    if (easterEggComponent) {
      return easterEggComponent; // Render the Easter egg component if a cheat code is matched
    }

    switch (selectedPage) {
      case Page.SelectDisk:
        return <SelectDisk onDiskSelect={handleDiskSelect} />;
      case Page.DiskImage:
        return selectedDisk ? (
          <DiskImage deviceNode={selectedDisk.deviceNode} volumeName={selectedDisk.volumeName} onShowRecoverableFiles={handleShowRecoverableFiles} />
        ) : (
          <p>Please select a filesystem first.</p>
        );
      case Page.RecoverableFiles:
        return <RecoverableFiles onRecoverAllFiles={handleRecoverAllFiles} />;
      case Page.Recovery:
        return <Recovery recoveryData={recoveryData} />;
      case Page.HowToUse:
        return <HowToUse />;
      case Page.DevelopersGuide:
        return <DevelopersGuide />;
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
