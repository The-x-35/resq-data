import React from 'react';
import './HowToUse.css';
import sd from '../../assets/ss/sd.png';
import di from '../../assets/ss/di.png';
import rf from '../../assets/ss/rf.png';
import r from '../../assets/ss/r.png';

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
        <img src={sd} alt="sd" />
        <li>Step 2: On the disk image page you have to complete three steps, first unmount the disk, then make disk image which can take time, then click show recoverable files to see them on the next page.</li>
        <img src={di} alt="di" />
        <li>Step 3: On the recoverable files page, by default you are only shown the files which can be easily recovered, you can select multiple files and folders which you want to recover. If you are an advanced user, you can click the show all files toggle,which will also show the files not easily recoverable and the configuration files.
                    You can click the select all checkbox if you want to recover all of them.
                    Then click the recover button to proceed further.
        </li>
        <img src={rf} alt="rf" />
        <li>Step 4: It will take time as required and recover your files.
                    On the next page after the success message, click the open recovered files button and it will take you to the folder where the files have been successfully recovered.
        </li>
        <img src={r} alt="r" />
        <li>Open the developer's guide if you want to contribute to the project.</li>
      </ul>
    </div>
  );
};

export default HowToUse;
