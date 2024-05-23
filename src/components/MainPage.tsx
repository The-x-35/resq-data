import React from 'react'
import logo from '../../assets/icon.png';
import Sidebar from './Sidebar';
import CommandExecutor from './CommandExecutor';

const MainPage = () => {
  return (
    <div className="app-container">
      <Sidebar />
      {/* Other components for the main page */}
      <CommandExecutor />
    </div>

  )
}

export default MainPage
