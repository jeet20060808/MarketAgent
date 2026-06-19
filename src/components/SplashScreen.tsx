"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RobotLoader from './RobotLoader';
import AnimatedLogo from './AnimatedLogo';
import PulseLoader from './PulseLoader';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#1a1a1a] overflow-hidden"
        >
          {/* Custom style injection for CSS animations */}
          <style>{`
            .wave-flow-left {
              animation: flow-left 15s linear infinite;
            }
            .wave-flow-right {
              animation: flow-right 22s linear infinite;
            }
            .wave-flow-left-fast {
              animation: flow-left 10s linear infinite;
            }

            @keyframes flow-left {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            @keyframes flow-right {
              0% {
                transform: translateX(-50%);
              }
              100% {
                transform: translateX(0);
              }
            }
          `}</style>

          {/* Horizontal Waves Background in the Middle */}
          <div 
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[240px] pointer-events-none overflow-hidden z-10"
            style={{ width: '100%' }}
          >
            {/* Center Glow Strip */}
            <div 
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[180px] pointer-events-none z-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(255, 138, 0, 0) 0%, rgba(255, 110, 0, 0.08) 50%, rgba(255, 138, 0, 0) 100%)',
                filter: 'blur(25px)'
              }}
            />
            
            {/* Wave 1 */}
            <svg 
              className="absolute top-0 left-0 wave-flow-left z-10" 
              viewBox="0 0 2880 240" 
              preserveAspectRatio="none"
              width="200%"
              height="100%"
              style={{ pointerEvents: 'none' }}
            >
              <path 
                d="M 0 120 Q 180 150, 360 120 T 720 120 T 1080 120 T 1440 120 T 1800 120 T 2160 120 T 2520 120 T 2880 120" 
                fill="none" 
                stroke="#FF8A00" 
                strokeOpacity="0.35"
                strokeWidth="2.5"
                style={{
                  filter: 'drop-shadow(0px 0px 6px rgba(255, 138, 0, 0.45))'
                }}
              />
            </svg>

            {/* Wave 2 */}
            <svg 
              className="absolute top-0 left-0 wave-flow-right z-10" 
              viewBox="0 0 2880 240" 
              preserveAspectRatio="none"
              width="200%"
              height="100%"
              style={{ pointerEvents: 'none' }}
            >
              <path 
                d="M 0 100 Q 240 70, 480 100 T 960 100 T 1440 100 T 1920 100 T 2400 100 T 2880 100" 
                fill="none" 
                stroke="#FF5500" 
                strokeOpacity="0.25"
                strokeWidth="1.8"
                style={{
                  filter: 'drop-shadow(0px 0px 6px rgba(255, 85, 0, 0.35))'
                }}
              />
            </svg>

            {/* Wave 3 */}
            <svg 
              className="absolute top-0 left-0 wave-flow-left-fast z-10" 
              viewBox="0 0 2880 240" 
              preserveAspectRatio="none"
              width="200%"
              height="100%"
              style={{ pointerEvents: 'none' }}
            >
              <path 
                d="M 0 140 Q 144 165, 288 140 T 576 140 T 1152 140 T 1728 140 T 2304 140 T 2880 140" 
                fill="none" 
                stroke="#FFAA44" 
                strokeOpacity="0.2"
                strokeWidth="1.2"
                style={{
                  filter: 'drop-shadow(0px 0px 6px rgba(255, 170, 68, 0.3))'
                }}
              />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-20 flex flex-col items-center gap-6"
          >
            {/* Robot Loader */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="scale-75 md:scale-90 flex items-center justify-center"
            >
              <RobotLoader />
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              className="scale-110 flex items-center justify-center mt-2"
            >
              <AnimatedLogo />
            </motion.div>

            {/* Brand Name */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              className="text-[#FF8A00] font-bold tracking-widest text-3xl md:text-4xl landing-heading"
            >
              AXORA AI
            </motion.h1>

            {/* Pulsing Dots Loader */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-4"
            >
              <PulseLoader />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
