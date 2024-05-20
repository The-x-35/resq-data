import React, { useEffect } from 'react';
import logo from '../../assets/icon.png';
import iitb from '../../assets/iitb.png';
import tl from '../../assets/tl.png';
import soc from '../../assets/soc.png';
import './SplashScreen.css';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/main'); // Replace '/next-page' with your desired route
    }, 6000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigate]);

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
        Made by The X35
      </div>
    </div>
  );
}

export default SplashScreen;
