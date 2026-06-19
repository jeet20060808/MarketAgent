"use client";
import React from 'react';
import styled from 'styled-components';

const PulseLoader = () => {
  return (
    <StyledWrapper>
      <section className="dots-container">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </section>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .dot {
    height: 12px;
    width: 12px;
    margin-right: 8px;
    border-radius: 50%;
    background-color: #ffd8b3;
    animation: pulse 1.5s infinite ease-in-out;
  }

  .dot:last-child {
    margin-right: 0;
  }

  .dot:nth-child(1) {
    animation-delay: -0.4s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0s;
  }

  .dot:nth-child(4) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(5) {
    animation-delay: 0.4s;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      background-color: #ffd8b3;
      box-shadow: 0 0 0 0 rgba(255, 216, 179, 0.7);
    }

    50% {
      transform: scale(1.2);
      background-color: #FF8A00;
      box-shadow: 0 0 0 8px rgba(255, 216, 179, 0);
    }

    100% {
      transform: scale(0.8);
      background-color: #ffd8b3;
      box-shadow: 0 0 0 0 rgba(255, 216, 179, 0.7);
    }
  }
`;

export default PulseLoader;
