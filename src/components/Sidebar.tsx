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
        <li className="sidebar-option">Option 1</li>
        <li className="sidebar-option">Option 2</li>
        <li className="sidebar-option">Option 3</li>
        <li className="sidebar-option">Option 4</li>
      </ul>
      <div className="sidebar-buttons">
        <button className="sidebar-button">How to Use</button>
        <button className="sidebar-button">How it Works</button>
      </div>
    </div>
  );
};

export default Sidebar;
