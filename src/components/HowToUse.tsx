import React from 'react';
// import './HowToUse.css';

const HowToUse: React.FC = () => {
  return (
    <div className="how-to-use">
      <h1>How to Use ResQ Data</h1>
      <p>Welcome to the ResQ Data guide. Here you'll find instructions on how to use the application effectively.</p>
      <ul>
        <li>Step 1: Select a disk from the 'Select Disk' page.</li>
        <li>Step 2: Create a disk image from the 'Disk Image' page.</li>
        <li>Step 3: View and select recoverable files from the 'Recoverable Files' page.</li>
        <li>Step 4: Recover selected files from the 'Recovery' page.</li>
      </ul>
    </div>
  );
};

export default HowToUse;
