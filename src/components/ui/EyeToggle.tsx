import React from 'react';
import './EyeToggle.css';

interface EyeToggleProps {
  onChange: (isChecked: boolean) => void;
}

const EyeToggle: React.FC<EyeToggleProps> = ({ onChange }) => {
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className="toggle">
      <input type="checkbox" id="btn" className="eye-toggle-input" onChange={handleToggle} />
      <label htmlFor="btn">
        <div className="track"></div>
        <div className="thumb">
          <span className="eye"></span>
        </div>
      </label>
    </div>
  );
};

export default EyeToggle;
