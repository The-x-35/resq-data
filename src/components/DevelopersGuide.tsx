import React from 'react';
import './DevelopersGuide.css';
import logo from '../../assets/icon.jpg';

const DevelopersGuide: React.FC = () => {
  return (
    <div className="developers-guide">
      <div className='dg-top'>
        <h1>ResQ Data</h1>
        <p>It is an open-source cross-platform data recovery tool based on The Sleuth Kit made in IIT Bombay TrustLab FOSSx Summer of Code.</p>
        <img src={logo} alt="ResQ Data Logo" className="logo" />
      </div>
      <h2>Run Locally</h2>
      <p>Make sure you have The Sleuth Kit installed.</p>
      
      <h3>For Linux</h3>
      <pre>
        <code>
          sudo apt-get install sleuthkit
        </code>
      </pre>
      
      <h3>For MacOS</h3>
      <pre>
        <code>
          brew install sleuthkit
        </code>
      </pre>
      
      <h3>Clone the project</h3>
      <pre>
        <code>
          git clone https://github.com/The-x-35/resq-data
        </code>
      </pre>
      
      <h3>Go to the project directory</h3>
      <pre>
        <code>
          cd resq-data/
        </code>
      </pre>
      
      <h3>Get Sudo access</h3>
      <pre>
        <code>
          sudo su
        </code>
      </pre>
      
      <h3>Install dependencies</h3>
      <pre>
        <code>
          npm install
        </code>
      </pre>
      
      <h3>To start Development Environment</h3>
      <pre>
        <code>
          npm run start
        </code>
      </pre>
      
      <h3>To build production release</h3>
      <pre>
        <code>
          npm run build
          npm run package
        </code>
      </pre>
    </div>
  );
};

export default DevelopersGuide;
