import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@material-ui/core';

import './FrameSelector.css';

const FrameSelector = ({ value, min, max, onChange }) => {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  const renderSlider = () => {
    if (max > min) {
      return (
        <div className="slider-container">
          <Slider
            className="slider"
            value={value}
            min={min}
            max={max}
            onChange={handleChange}
            aria-labelledby="frame-slider"
          />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="frame-selector">
      <div className="label-container">
        <label htmlFor="frame-slider" className="label">
          Frame
        </label>
      </div>
      {renderSlider()}
    </div>
  );
};

FrameSelector.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FrameSelector;