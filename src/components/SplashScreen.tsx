import React from 'react';
import logo from '../../assets/icon.png';
import iitb from '../../assets/iitb.png';
import tl from '../../assets/tl.png';
import soc from '../../assets/soc.png';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-container">
      <img src={logo} className="splash-logo" alt="Logo" />
      <h1 className="splash-title">ResQ Data</h1>
      <div className="splash-images">
        <img src={iitb} alt="IITB" />
        <img src={tl} alt="TL" />
        <img src={soc} className="soc" alt="SOC" />
      </div>
      <div className="splash-footer">
        Made by Arpit Singh Bhatia
      </div>
    </div>
  );
}

export default SplashScreen;
