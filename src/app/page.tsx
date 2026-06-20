"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronsRight, Menu, ChevronsLeft, Plus } from "lucide-react";
import Aurora from "../components/Aurora/Aurora";
import AgentsSection from "../components/AgentsSection";
import WordSearch from "@/components/WordSearch";
import AnimatedLogo from "@/components/AnimatedLogo";

const float = (
  delay = 0,
  duration = 4,
  distance = 10,
  rotateFloat = 0,
  scaleFloat = 1
) => ({
  animate: {
    y: [0, -distance, 0],
    rotate: rotateFloat
      ? [-rotateFloat, rotateFloat, -rotateFloat]
      : undefined,
    scale:
      scaleFloat > 1
        ? [1, scaleFloat, 1]
        : undefined,
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

function PixelLogo() {
  return (
    <div className="grid grid-cols-2 gap-[3px] w-[22px] h-[22px]">
      <div className="bg-[#FF8A00] rounded-[2px]" />
      <div className="bg-[#FF8A00] rounded-[2px]" />
      <div className="bg-[#FF8A00] rounded-[2px]" />
      <div className="bg-[#FF8A00] rounded-[2px]" />
    </div>
  );
}

function FloatingDevice({
  src,
  alt,
  width,
  height,
  x,
  y,
  zIndex = 10,
  delay = 0,
  duration = 4,
  rotate = 0,
  priority = false,
  distance = 10,
  rotateFloat = 0,
  scaleFloat = 1,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  x: string;
  y: string;
  zIndex?: number;
  delay?: number;
  duration?: number;
  rotate?: number;
  priority?: boolean;
  distance?: number;
  rotateFloat?: number;
  scaleFloat?: number;  
}) {
  return (
    // <motion.div
    //   className="absolute pointer-events-none"
    //   style={{ left: x, top: y, transform: "translate(-50%, -50%)", zIndex }}
      // {...float(
      //   delay,
      //   duration,
      //   distance,
      //   rotateFloat,
      //   scaleFloat
      // )}
    // >
    //   <div className="device-shadow-wrap" style={{ width, height }}>
    <motion.div
  className="absolute pointer-events-none"
  style={{
    left: x,
    top: y,
    transform: "translate(-50%, -50%)",
    zIndex,
  }}
  
>
<motion.div
  {...float(
    delay,
    duration,
    distance,
    rotateFloat,
    scaleFloat
  )}
>
  <div
    className="device-shadow-wrap"
    style={{
      width,
      height,
    }}
  >
        <Image
          src={`${src}?v=4`}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          unoptimized
          className="device-cutout w-full h-full object-contain"
          style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
          draggable={false}
        />
          </div>
  </motion.div>
</motion.div>
  )
}

function DecorativeShards() {
  const shards = [
    { top: "28%", left: "34%", size: 10, rot: 25, delay: 0.2 },
    { top: "52%", left: "70%", size: 8, rot: -40, delay: 0.8 },
    { top: "62%", left: "30%", size: 12, rot: 60, delay: 1.1 },
    { top: "22%", left: "84%", size: 9, rot: -15, delay: 0.5 },
  ];

  return (
    <>
      {shards.map((s, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#ccc] border border-black/15 pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            transform: `rotate(${s.rot}deg)`,
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            zIndex: 5,
          }}
          {...float(s.delay, 3 + i * 0.5)}
        />
      ))}
      <motion.div
        className="absolute top-[48%] left-[50%] w-[18px] h-[18px] border-[3px] border-[#FF8A00] rounded-full pointer-events-none"
        style={{ zIndex: 5 }}
        {...float(1.4, 4.8)}
      />
      <motion.div
        className="absolute top-[56%] left-[58%] w-[12px] h-[12px] border-[2.5px] border-[#FF8A00] rounded-full pointer-events-none"
        style={{ zIndex: 5 }}
        {...float(0.1, 3.6)}
      />
    </>
  );
}
// function FloatingParticles() {
//   const particles = Array.from({ length: 25 });

//   return (
//     <>
//       {particles.map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute text-[#FF8A00] font-bold pointer-events-none"
//           style={{
//             top: `${Math.random() * 90}%`,
//             left: `${Math.random() * 90}%`,
//             fontSize: `${10 + Math.random() * 12}px`,
//             zIndex: 2,
//           }}
//           animate={{
//             y: [0, -15, 0],
//             opacity: [0.2, 1, 0.2],
//             scale: [1, 1.3, 1],
//           }}
//           transition={{
//             duration: 2 + Math.random() * 4,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: Math.random() * 3,
//           }}
//         >
//           ✦
//         </motion.div>
//       ))}
//     </>
//   );
// }
function FloatingBubbles() {
  const [bubbles, setBubbles] = React.useState<
    { size: number; left: string; top: string; xDrift: number[]; duration: number; delay: number }[]
  >([]);

  React.useEffect(() => {
    setBubbles(
      Array.from({ length: 15 }, () => {
        const size = 10 + Math.random() * 30;
        return {
          size,
          left: `${Math.random() * 100}%`,
          top: `${100 + Math.random() * 20}%`,
          xDrift: [0, Math.random() * 40 - 20, Math.random() * 40 - 20],
          duration: 8 + Math.random() * 5,
          delay: Math.random() * 8,
        };
      })
    );
  }, []);

  if (bubbles.length === 0) return null;

  return (
    <>
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#f2eeeb]/40 border- border-[#f2eeeb]"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            zIndex: 25,
          }}
          animate={{
            y: [-600],
            opacity: [0, 1, 1, 0],
            x: b.xDrift,
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            repeatType: "loop",
            delay: b.delay,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
}
export default function LandingPage() {
  return (
    
    <div className="landing-shell min-h-screen bg-[#f5ebe4 p-3 md:p-5">
      <div className="landing-window relative w-full max-w-[1440px] min-h-[calc(100vh-24px)] md:min-h-[calc(100vh-40px)] bg-[#f5dccb] border-[10px] border-[#adacaa] rounded-[28px] md:rounded-[36px] overflow-hidden flex flex-col shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]">
  <div className="absolute inset-0 z-0 opacity-70">
    <Aurora
      colorStops={["#FF8A00", "#FFB347", "#FFD6A5"]}
      blend={0.45}
      amplitude={1.2}
      speed={0.4}
    />
  </div>

  {/* Animated grid overlay — fades bottom to top */}
  <div className="landing-grid-bg z-[1]" />

  {/* rest of your content */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">

<span className="landing-pixel-text absolute left-[2%] top-[55%] text-white opacity-100 leading-none z-[50]">
  AXORA
</span>

<span className="landing-pixel-text absolute right-[2%] top-[68%] text-white opacity-100 leading-none z-[1]">
  AGENT
</span>

</div>

        <header className="relative z-40 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
          <div className="flex items-center gap-2.5">
            <AnimatedLogo />
            <span className="landing-heading font-bold text-lg md:text-xl tracking-tight text-[#1a1a1a]">
              AXORA AI
            </span>
          </div>
          <Link
            href="/dashboard"
            className="landing-heading bg-[#FF8A00] text-[#1a1a1a] font-bold text-[13px] pl-5 pr-1.5 py-1.5 rounded-xl flex items-center gap-3 hover:bg-black hover:text-white transition-all duration-300 group shadow-sm"
          >
            <span className="uppercase">START NOW</span>
            <div className="bg-white text-[#1a1a1a] p-2 rounded-lg transition-colors duration-300 group-hover:bg-[#FF8A00] group-hover:text-white">
              <ChevronsRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </div>
          </Link>
        </header>

        <main className="relative z-10 flex-1 px-6 md:px-10 pb-6 md:pb-8 min-h-[520px] md:min-h-[600px]">

          <div className="absolute left-6 md:left-10 top-[4%] md:top-[6%] z-30 max-w-[320px]">
            <span className="text-[11px] font-mono font-semibold text-[#888] tracking-wide mb-3 block">
              
            </span>
            <h1 className="landing-heading  text-[clamp(1.5rem,3.5vw,2.8rem)] font-bold leading-[1.02] tracking-tight text-[#1a1a1a] uppercase">
  RESEARCH DEEP
  <br />
  PLAN BETTER
  <br />
  LAUNCH FASTER
</h1>
          </div>

          <div className="absolute right-6 md:right-10 top-[6%] md:top-[8%] z-30 text-right">
            <Plus className="w-5 h-5 text-[#999] ml-auto mb-1" strokeWidth={2} />
            
            {/* <div className="text-[11px] font-mono font-semibold text-[#888] tracking-[0.15em] mt-1 uppercase">
              Efficiency
            </div> */}
          </div>

          {/* 3D device scene — laptop centered, devices in semicircle */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Aurora Background */}
  {/* <div className="absolute inset-0 opacity-60">
    <Aurora
      colorStops={[
        "#FF8A00",
        "#FFB347",
        "#FFE0B2"
      ]}
      amplitude={1.3}
      blend={0.4}
      speed={0.5}
    />
  </div> */}
            <DecorativeShards />
            {/* <FloatingParticles /> */}
            <FloatingBubbles />
            
            <div
              className="absolute left-1/2 top-[50%] -translate-x-1/2 w-[300px] md:w-[360px] h-[36px] rounded-[50%] bg-black/[0.1] blur-2xl"
              style={{ zIndex: 8 }}
            />

            {/* Laptop — dead center */}
            <FloatingDevice
  src="/landing/laptop2.png"
  alt="Laptop"
  width={480}
height={470}
  x="50%"
  y="65%"
  zIndex={30}
  duration={7}
  distance={6}
  rotateFloat={1}
  priority
  rotate={5}
/>

            {/* Semicircle left → right around laptop */}
            <FloatingDevice
  src="/landing/chip3.png"
  alt="Chip"
  width={120}
height={120}
  x="70%"
  y="75%"
  zIndex={31}
  rotate={-10}
  duration={3}
  distance={10}
/>

<FloatingDevice
  src="/landing/cell.png"
  alt="Phone"
  width={295}
height={295}
  x="28%"
  y="68%"
  zIndex={15}
  rotate={-3}
  duration={4}
  distance={18}
  rotateFloat={3}
/>

<FloatingDevice
  src="/landing/chip3.png"
  alt="chip2"
  width={150}
  height={150}
  x="35%"
  y="35%"
  zIndex={18}
  rotate={30}
  duration={5}
  distance={14}
  rotateFloat={5}
/>

<FloatingDevice
  src="/landing/robot.png"
  alt="Robot arm"
  width={200}
height={200}
  x="50%"
  y="25%"
  zIndex={25}
  rotate={-35}
  duration={8}
  distance={22}
  rotateFloat={4}
/>

<FloatingDevice
  src="/landing/analytics.png"
  alt="Analytics"
  width={120}
height={120}
  x="65%"
  y="25%"
  zIndex={36}
  rotate={8}
  duration={3}
  distance={12}
/>

<FloatingDevice
  src="/landing/eye.png"
  alt="AI eye"
  width={105}
height={105}
  x="73%"
  y="50%"
  zIndex={28}
  rotate={-45}
  duration={5}
  distance={15}
  scaleFloat={1.08}
/>

            {/* <FloatingDevice
              src="/landing/cable.png"
              alt="Sensor cable"
              width={185}
              height={145}
              x="74%"
              y="54%"
              zIndex={22}
              delay={0.5}
              rotate={-5}
            /> */}
          </div>



          <div className="absolute right-6 md:right-10 bottom-[16%] md:bottom-[14%] z-30 max-w-[220px] text-right hidden sm:block">
            {/* <p className="text-[13px] font-semibold text-[#4a4a4a] leading-relaxed">
              From idea to investor-ready package — we build with precision.
            </p> */}
          </div>
        </main>

        <footer className="relative z-40 flex justify-center mt-25">
          <div className="landing-scroll-pill bg-[#d8d8d8] border border-[#c0c0c0] border-b-0 px-8 py-2.5 rounded-t-[20px] flex items-center gap-2.5 text-[10px] font-mono font-bold tracking-[0.12em] text-[#888] uppercase">
            <svg width="12" height="18" viewBox="0 0 12 18" fill="none" className="opacity-60">
              <rect x="1" y="1" width="10" height="16" rx="5" stroke="#888" strokeWidth="1.5" />
              <circle cx="6" cy="6" r="1.5" fill="#888" className="animate-bounce" />
            </svg>
            Scroll to explore more
          </div>
                </footer>
                </div> {/* END landing-window */}

<div className="mt-6">
  <AgentsSection />
</div>
<section className="mt-6">
  <div className="relative w-full bg-[#f5dccb] border-[10px] border-[#adacaa] rounded-[36px] overflow-hidden py-24">
    
    {/* Grid Background */}
    <div className="ws-grid-bg" />

    {/* Bottom Orange Gradient */}
    <div className="ws-bottom-gradient" />

    <div className="relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="font-heading text-6xl font-bold text-black mb-6 text-center"
      >
        Build With Ideas
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="font-heading text-lg text-black max-w-2xl mx-auto text-center mb-16"
      >
        AI Founder OS deploys specialized agents across every business function.
      </motion.p>

      <WordSearch />
    </div>

    {/* Floating Robot in the bottom right corner of the box */}
    <div className="hidden md:block">
      <FloatingDevice
        src="/landing/wr.png"
        alt="Agent Robot"
        width={520}
        height={570}
        x="84%"
        y="75%"
        zIndex={20}
        delay={0.4}
        duration={4.5}
        distance={12}
      />
    </div>

  </div>
</section>
</div> 
  );
}