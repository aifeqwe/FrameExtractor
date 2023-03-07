import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  position: relative;
  height: 4px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
`;

const ProgressBarFill = styled.div`
  position: absolute;
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  transition: width 0.1s ease-in-out;
`;

const ProgressBar = ({ progress }) => (
  <ProgressBarContainer>
    <ProgressBarFill progress={progress} />
  </ProgressBarContainer>
);

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
};

export default ProgressBar;
