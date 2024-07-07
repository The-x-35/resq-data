import React from 'react';
// import './DevelopersGuide.css';

const DevelopersGuide: React.FC = () => {
  return (
    <div className="developers-guide">
      <h1>Developer's Guide</h1>
      <p>Welcome to the Developer's Guide for ResQ Data. This section provides information for developers contributing to the project.</p>
      <ul>
        <li>Step 1: Clone the repository from GitHub.</li>
        <li>Step 2: Install dependencies using <code>npm install</code>.</li>
        <li>Step 3: Run the application using <code>npm start</code>.</li>
        <li>Step 4: Follow the coding standards and guidelines provided in the repository.</li>
      </ul>
    </div>
  );
};

export default DevelopersGuide;
