import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import logo from '../../assets/icon.png';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 200); // Delay to ensure transition is noticeable
  }, []);


  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img src={logo} alt="App Logo" />
        <span>ResQ Data</span>
      </div>
      <ul className="sidebar-options">
        <li className="sidebar-option">
          <img src={logo} alt="Select Disk icon" />
          Select Disk
        </li>
        <li className="sidebar-option">
          <img src={logo} alt="Disk Image icon" />
          Disk Image
        </li>
        <li className="sidebar-option">
          <img src={logo} alt="Recoverable Files icon" />
          Recoverable files
        </li>
        <li className="sidebar-option">
          <img src={logo} alt="Recovery icon" />
          Recovery
        </li>
      </ul>
      <div className="sidebar-buttons">
        <button className="sidebar-button">How to Use?</button>
        <button className="sidebar-button">Developer's Guide</button>
      </div>
    </div>
  );
};

export default Sidebar;
