import React from 'react';
// import './HowToUse.css';
import r from '../../assets/recovery.svg';

const HowToUse: React.FC = () => {
  return (
    <div className="how-to-use">
      <h1>How to Use ResQ Data</h1>
      <p>Welcome to the ResQ Data guide. Here you'll find instructions on how to use the application effectively.</p>
      <ul>
        <li>Step 1: Select the disk on which you want to perform the operations.
            If you want to take the disk image backup then select the interval and schedule backup, 
            else click confirm selection to continue with the data recovery process.
        </li>

        <li>Step 2: Create a disk image from the 'Disk Image' page.</li>
        <li>Step 3: View and select recoverable files from the 'Recoverable Files' page.</li>
        <li>Step 4: Recover selected files from the 'Recovery' page.</li>
      </ul>
    </div>
  );
};

export default HowToUse;
