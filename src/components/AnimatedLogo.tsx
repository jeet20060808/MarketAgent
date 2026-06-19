"use client";
import React from 'react';
import styled from 'styled-components';
import { Bot } from 'lucide-react';

const AnimatedLogo = () => {
  return (
    <StyledWrapper>
      <button className="button">
        <p className="button__text">
          <span style={{ "--index": 0 } as React.CSSProperties}>A</span>
          <span style={{ "--index": 1 } as React.CSSProperties}>X</span>
          <span style={{ "--index": 2 } as React.CSSProperties}>O</span>
          <span style={{ "--index": 3 } as React.CSSProperties}>R</span>
          <span style={{ "--index": 4 } as React.CSSProperties}>A</span>
          <span style={{ "--index": 5 } as React.CSSProperties}> </span>
          <span style={{ "--index": 6 } as React.CSSProperties}>A</span>
          <span style={{ "--index": 7 } as React.CSSProperties}>I</span>
          <span style={{ "--index": 8 } as React.CSSProperties}> </span>
          <span style={{ "--index": 9 } as React.CSSProperties}>•</span>
          <span style={{ "--index": 10 } as React.CSSProperties}> </span>
          <span style={{ "--index": 11 } as React.CSSProperties}>A</span>
          <span style={{ "--index": 12 } as React.CSSProperties}>X</span>
          <span style={{ "--index": 13 } as React.CSSProperties}>O</span>
          <span style={{ "--index": 14 } as React.CSSProperties}>R</span>
          <span style={{ "--index": 15 } as React.CSSProperties}>A</span>
          <span style={{ "--index": 16 } as React.CSSProperties}> </span>
          <span style={{ "--index": 17 } as React.CSSProperties}>A</span>
          <span style={{ "--index": 18 } as React.CSSProperties}>I</span>
          <span style={{ "--index": 19 } as React.CSSProperties}> </span>
          <span style={{ "--index": 20 } as React.CSSProperties}>•</span>
          <span style={{ "--index": 21 } as React.CSSProperties}> </span>
        </p>
        <div className="button__circle">
          <Bot className="button__icon" size={16} strokeWidth={2.5} />
          <Bot className="button__icon button__icon--copy" size={16} strokeWidth={2.5} />
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    border: none;
    background: #FF8A00; /* Orange color */
    color: #fff;
    width: 65px; /* Size a little small */
    height: 65px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: grid;
    place-content: center;
    transition:
      background 300ms,
      transform 200ms;
    font-weight: 600;
  }

  .button__text {
    position: absolute;
    inset: 0;
    animation: text-rotation 8s linear infinite;
    font-size: 8px; /* Adjusted font size for the new text */
    letter-spacing: 1px;

    > span {
      position: absolute;
      transform: rotate(calc(16.36deg * var(--index))); /* 360 / 22 characters = 16.36deg */
      inset: 4px;
      display: block;
      text-align: center;
    }
  }

  .button__circle {
    position: relative;
    width: 28px;
    height: 28px;
    overflow: hidden;
    background: #212121;
    color: #FF8A00; /* Orange color */
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .button__icon--copy {
    position: absolute;
    transform: translate(-150%, 150%);
  }

  .button:hover {
    background: #000;
    transform: scale(1.05);
  }

  .button:hover .button__icon {
    color: #fff;
  }

  .button:hover .button__icon:first-child {
    transition: transform 0.3s ease-in-out;
    transform: translate(150%, -150%);
  }

  .button:hover .button__icon--copy {
    transition: transform 0.3s ease-in-out 0.1s;
    transform: translate(0);
  }

  @keyframes text-rotation {
    to {
      rotate: 360deg;
    }
  }

  .button:active {
    transform: scale(0.95);
  }
`;

export default AnimatedLogo;
