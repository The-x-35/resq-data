import React from 'react';
import logo from '../../assets/icon.png';
import Sidebar from './Sidebar';
import SelectDisk from './SelectDisk';
import './MainPage.css';

const MainPage: React.FC = () => {
  return (
    <div className="Page">
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <SelectDisk />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
