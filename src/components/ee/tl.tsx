import React from 'react';
import rr from '../../../assets/rickroll.jpg';
import './TL.css'; // Import the CSS file

const TL: React.FC = () => {
  return (
    <div className="easter-egg">
      <h1>Congratulations! You've discovered the first Easter egg!</h1>
      <p>This is a special hidden component.</p>
      <img src={rr} alt="RickRoll" />
    </div>
  );
};

export default TL;
