"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/* ───────── icon components (simple SVG icons to match the reference) ───────── */
const icons: Record<string, React.ReactNode> = {
  "Market Research": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  "Startup advisor Agent": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  "Product Manager Agent": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  ),
  "Engineering Agent": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
  "Financial analyst Agent": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  "Marketing Agent": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  "Risk Agent": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  "Architect Agent": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
  ),
};

/* ───────── sparkle / particle layer ───────── */
function Sparkles() {
  const [particles, setParticles] = React.useState<
    { x: string; y: string; size: number; delay: number; duration: number }[]
  >([]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setParticles(
        Array.from({ length: 35 }, () => ({
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          size: 2 + Math.random() * 4,
          delay: Math.random() * 5,
          duration: 2 + Math.random() * 3,
        }))
      );
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background:
              i % 3 === 0
                ? "radial-gradient(circle, #fff 0%, #ffe4c4 100%)"
                : "radial-gradient(circle, #ffd699 0%, #e9891600 100%)",
            boxShadow: i % 3 === 0 ? "0 0 6px 2px rgba(255,255,255,0.6)" : "0 0 4px 1px rgba(233,160,50,0.4)",
            zIndex: 5,
          }}
          animate={{
            opacity: [0, 1, 0.6, 1, 0],
            scale: [0.5, 1.3, 0.8, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

/* ───────── floating bubbles (warm, subtle) ───────── */
function FloatingBubbles() {
  const [bubbles, setBubbles] = React.useState<
    { size: number; left: string; top: string; xDrift: number[]; duration: number; delay: number }[]
  >([]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setBubbles(
        Array.from({ length: 12 }, () => {
          const size = 10 + Math.random() * 25;
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
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (bubbles.length === 0) return null;

  return (
    <>
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            background: "radial-gradient(circle, rgba(255,200,130,0.5) 0%, rgba(255,179,71,0.15) 100%)",
            border: "1px solid rgba(255,255,255,0.3)",
            zIndex: 5,
          }}
          animate={{
            y: [-600],
            opacity: [0, 0.8, 0.8, 0],
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

/* ───────── main component ───────── */
export default function AgentsSection() {
  const agents = [
    {
      title: "Market Research",
      desc: "It studies competitors, trends, and market demand. This helps you see where the idea can fit. It also points out gaps worth exploring.",
    },
    {
      title: "Startup advisor Agent",
      desc: "It checks if the idea solves a real problem. It also looks at whether people would actually use it. This helps you know if the idea is worth building.",
    },
    {
      title: "Product Manager Agent",
      desc: "It turns the idea into clear product requirements. It lists the main features, users, and goals. This gives you a simple plan to build from.",
    },
    {
      title: "Engineering Agent",
      desc: "It creates a simple launch plan for the product. It suggests how to reach users and promote the idea. This helps you start with a clear go-to-market path.",
    },
    {
      title: "Financial analyst Agent",
      desc: "It estimates revenue, costs, and cash needs. It helps you understand if the business can make money. This gives you a basic financial picture.",
    },
    {
      title: "Marketing Agent",
      desc: "It prepares short investor-friendly points for the idea. It highlights the problem, solution, and market opportunity. This makes the pitch easier to present.",
    },
    {
      title: "Risk Agent",
      desc: "It prepares short investor-friendly points for the idea. It highlights the problem, solution, and market opportunity. This makes the pitch easier to present.",
    },
    {
      title: "Architect Agent",
      desc: "It prepares short investor-friendly points for the idea. It highlights the problem, solution, and market opportunity. This makes the pitch easier to present.",
    },
  ];

  const [flippedCard, setFlippedCard] = React.useState<number | null>(null);

  /* ── orbital animation: build keyframe arrays for each card ── */
  const orbitRadiusX = 370;   // horizontal radius of the ellipse
  const orbitRadiusY = 280;   // vertical radius of the ellipse
  const orbitSteps = 60;      // smoothness of the orbit path
  const orbitDuration = 45;   // seconds for one full revolution

  const buildOrbitPath = (index: number) => {
    const phase = (index / agents.length) * Math.PI * 2;

    return Array.from({ length: orbitSteps + 1 }, (_, step) => {
      const progress = (step / orbitSteps) * Math.PI * 2;
      const angle = phase + progress;

      return {
        x: Math.cos(angle) * orbitRadiusX,
        y: Math.sin(angle) * orbitRadiusY,
      };
    });
  };

  return (
    <section
      className="landing-window relative w-full max-w-[1440px] min-h-[calc(100vh-24px)] md:min-h-[calc(100vh-40px)] border-[10px] border-[#adacaa] rounded-[28px] md:rounded-[36px] overflow-hidden flex flex-col shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]"
      style={{
        background: "linear-gradient(170deg, #fce8d4 0%, #f5cca8 25%, #edd4b8 50%, #f0c89e 75%, #f5dccb 100%)",
      }}
    >
      {/* ── warm radial glow background layers ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Main warm glow center */}
        <div
          className="absolute"
          style={{
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            height: "70%",
            background: "radial-gradient(circle, rgba(255,200,130,0.5) 0%, rgba(245,190,140,0.2) 40%, transparent 70%)",
          }}
        />
        {/* Secondary glow bottom */}
        <div
          className="absolute"
          style={{
            bottom: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "50%",
            background: "radial-gradient(ellipse, rgba(240,180,100,0.3) 0%, transparent 70%)",
          }}
        />
        {/* Subtle golden ring (orbit hint) */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "680px",
            height: "680px",
            border: "1px solid rgba(218,170,120,0.15)",
            borderRadius: "50%",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "520px",
            height: "520px",
            border: "1px solid rgba(218,170,120,0.1)",
            borderRadius: "50%",
          }}
        />
      </div>

      <FloatingBubbles />
      <Sparkles />

      {/* Animated background glow */}
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,180,80,0.25) 0%, transparent 70%)",
        }}
        animate={{
          x: [-40, 40, -40],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 flex-1 px-6 md:px-10 py-24">
        {/* Heading */}
        <div className="text-center mb-16">
          <p
            className="font-heading uppercase tracking-[0.3em] mb-4"
            style={{ color: "#8B5E3C" }}
          >
            AI TEAM
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="font-heading text-6xl font-bold mb-6"
            style={{ color: "#2d1f10" }}
          >
            Meet Your AI Agents
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-heading text-lg max-w-2xl mx-auto"
            style={{ color: "#5a3e28" }}
          >
            Specialized agents work together to transform your idea into a
            complete startup plan.
          </motion.p>
        </div>

        {/* Cards + Robot orbit area */}
        <div className="relative mx-auto h-[620px] md:h-[760px] w-full max-w-[860px]">

          {/* ── Animated wave background behind robot ── */}
          <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">

            {/* Soft glowing circle (upper right) */}
            <motion.div
              className="absolute"
              style={{
                top: "12%",
                right: "25%",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                border: "1px solid rgba(230,190,150,0.15)",
                background: "radial-gradient(circle, rgba(255,230,200,0.12) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Sparkle dots */}
            {([
              { top: "18%", left: "35%", size: 5, delay: 0 },
              { top: "25%", right: "40%", size: 4, delay: 1.5 },
              { top: "40%", left: "15%", size: 6, delay: 0.8 },
              { top: "30%", right: "15%", size: 4, delay: 2.2 },
              { top: "55%", left: "60%", size: 5, delay: 1 },
              { top: "15%", left: "55%", size: 3, delay: 3 },
            ] as { top: string; left?: string; right?: string; size: number; delay: number }[]).map((dot, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute rounded-full"
                style={{
                  top: dot.top,
                  left: dot.left,
                  right: dot.right,
                  width: dot.size,
                  height: dot.size,
                  background: "radial-gradient(circle, #fff 0%, rgba(255,210,150,0.8) 100%)",
                  boxShadow: `0 0 ${dot.size * 2}px rgba(255,200,130,0.6)`,
                }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
              />
            ))}

            {/* Dotted grid pattern – top left */}
            <div
              className="absolute"
              style={{
                top: "8%",
                left: "5%",
                width: "50px",
                height: "50px",
                backgroundImage: "radial-gradient(circle, rgba(200,160,120,0.25) 1.5px, transparent 1.5px)",
                backgroundSize: "10px 10px",
              }}
            />
            {/* Dotted grid pattern – bottom left */}
            <div
              className="absolute"
              style={{
                bottom: "15%",
                left: "8%",
                width: "45px",
                height: "55px",
                backgroundImage: "radial-gradient(circle, rgba(200,160,120,0.25) 1.5px, transparent 1.5px)",
                backgroundSize: "10px 10px",
              }}
            />
            {/* Dotted grid pattern – right */}
            <div
              className="absolute"
              style={{
                top: "20%",
                right: "6%",
                width: "40px",
                height: "45px",
                backgroundImage: "radial-gradient(circle, rgba(200,160,120,0.25) 1.5px, transparent 1.5px)",
                backgroundSize: "10px 10px",
              }}
            />
            {/* Dotted grid pattern – bottom right */}
            <div
              className="absolute"
              style={{
                bottom: "22%",
                right: "10%",
                width: "45px",
                height: "50px",
                backgroundImage: "radial-gradient(circle, rgba(200,160,120,0.2) 1.5px, transparent 1.5px)",
                backgroundSize: "10px 10px",
              }}
            />

            {/* ── Animated flowing waves ── */}
            {/* Wave layer 1 – deepest, slowest */}
            <motion.svg
              className="absolute bottom-0 left-0 w-[200%] h-[65%]"
              viewBox="0 0 1720 500"
              preserveAspectRatio="none"
              animate={{ x: [0, -860] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <linearGradient id="wave1grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(230,170,110,0.08)" />
                  <stop offset="100%" stopColor="rgba(230,170,110,0.25)" />
                </linearGradient>
              </defs>
              <path
                d="M0 280 C120 220 240 180 360 200 C480 220 520 300 680 280 C840 260 900 180 1060 200 C1220 220 1280 300 1440 280 C1560 260 1640 220 1720 240 L1720 500 L0 500 Z"
                fill="url(#wave1grad)"
              />
            </motion.svg>

            {/* Wave layer 2 – warm orange, medium speed */}
            <motion.svg
              className="absolute bottom-0 left-0 w-[200%] h-[60%]"
              viewBox="0 0 1720 500"
              preserveAspectRatio="none"
              animate={{ x: [0, -860] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <linearGradient id="wave2grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(240,160,80,0.15)" />
                  <stop offset="50%" stopColor="rgba(245,180,110,0.2)" />
                  <stop offset="100%" stopColor="rgba(240,150,70,0.12)" />
                </linearGradient>
              </defs>
              <path
                d="M0 300 C160 240 280 320 440 280 C600 240 700 200 860 240 C1020 280 1140 340 1300 280 C1460 220 1560 260 1720 300 L1720 500 L0 500 Z"
                fill="url(#wave2grad)"
              />
            </motion.svg>

            {/* Wave layer 3 – glowing line wave */}
            <motion.svg
              className="absolute bottom-0 left-0 w-[200%] h-[55%]"
              viewBox="0 0 1720 500"
              preserveAspectRatio="none"
              animate={{ x: [-860, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <path
                d="M0 320 C180 260 300 350 500 300 C700 250 800 200 1000 260 C1200 320 1350 360 1500 300 C1600 260 1660 280 1720 320"
                fill="none"
                stroke="rgba(240,170,90,0.25)"
                strokeWidth="1.5"
              />
              <path
                d="M0 330 C180 270 300 360 500 310 C700 260 800 210 1000 270 C1200 330 1350 370 1500 310 C1600 270 1660 290 1720 330"
                fill="none"
                stroke="rgba(255,200,130,0.15)"
                strokeWidth="1"
              />
            </motion.svg>

            {/* Wave layer 4 – brighter orange, faster */}
            <motion.svg
              className="absolute bottom-0 left-0 w-[200%] h-[50%]"
              viewBox="0 0 1720 500"
              preserveAspectRatio="none"
              animate={{ x: [0, -860] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <linearGradient id="wave4grad" x1="0" y1="0" x2="1" y2="0.5">
                  <stop offset="0%" stopColor="rgba(245,150,60,0.1)" />
                  <stop offset="40%" stopColor="rgba(250,180,100,0.22)" />
                  <stop offset="100%" stopColor="rgba(245,160,70,0.08)" />
                </linearGradient>
              </defs>
              <path
                d="M0 340 C200 280 350 370 560 320 C770 270 860 230 1060 290 C1260 350 1400 380 1560 320 C1660 280 1700 310 1720 340 L1720 500 L0 500 Z"
                fill="url(#wave4grad)"
              />
            </motion.svg>

            {/* Wave layer 5 – top accent line wave */}
            <motion.svg
              className="absolute bottom-0 left-0 w-[200%] h-[70%]"
              viewBox="0 0 1720 500"
              preserveAspectRatio="none"
              animate={{ x: [-860, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              <path
                d="M0 260 C140 220 320 300 520 250 C720 200 840 160 1040 220 C1240 280 1400 320 1520 260 C1620 220 1680 240 1720 260"
                fill="none"
                stroke="rgba(220,160,100,0.18)"
                strokeWidth="1"
              />
            </motion.svg>

            {/* Wave layer 6 – front-most soft fill */}
            <motion.svg
              className="absolute bottom-0 left-0 w-[200%] h-[40%]"
              viewBox="0 0 1720 500"
              preserveAspectRatio="none"
              animate={{ x: [0, -860] }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <linearGradient id="wave6grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(245,200,160,0.05)" />
                  <stop offset="100%" stopColor="rgba(240,180,130,0.18)" />
                </linearGradient>
              </defs>
              <path
                d="M0 360 C220 310 400 380 620 340 C840 300 960 270 1160 330 C1360 390 1500 400 1620 350 C1680 320 1710 340 1720 360 L1720 500 L0 500 Z"
                fill="url(#wave6grad)"
              />
            </motion.svg>

            {/* Glow highlights on wave peaks */}
            <motion.div
              className="absolute"
              style={{
                bottom: "35%",
                left: "20%",
                width: "120px",
                height: "40px",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(255,200,120,0.3) 0%, transparent 70%)",
                filter: "blur(6px)",
              }}
              animate={{ x: [0, 60, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute"
              style={{
                bottom: "40%",
                right: "25%",
                width: "100px",
                height: "35px",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(255,210,140,0.25) 0%, transparent 70%)",
                filter: "blur(5px)",
              }}
              animate={{ x: [0, -50, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>

          {/* Glowing platform under robot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            style={{ top: "calc(50% + 100px)" }}
          >
            <motion.div
              className="rounded-full"
              style={{
                width: "260px",
                height: "30px",
                background: "radial-gradient(ellipse, rgba(255,200,120,0.7) 0%, rgba(255,180,80,0.3) 50%, transparent 80%)",
                filter: "blur(8px)",
                marginLeft: "-130px",
              }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Center robot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center">
            <Image
              src="/landing/robo10.png"
              alt="Agent robot"
              width={1200}
              height={1500}
              unoptimized
              className="w-[320px] md:w-[420px] h-auto"
              style={{ width: "320px", maxWidth: "none", filter: "drop-shadow(0 8px 30px rgba(200,140,60,0.3))" }}
            />
          </div>

          {/* Orbit cards */}
          {agents.map((agent, index) => {
            const orbitPath = buildOrbitPath(index);

            return (
              <motion.div
                key={agent.title}
                className="absolute left-1/2 top-1/2"
                style={{
                  marginLeft: -100,
                  marginTop: -35,
                  perspective: 1200,
                  zIndex: flippedCard === index ? 50 : 10,
                }}
                initial={{ x: orbitPath[0].x, y: orbitPath[0].y, opacity: 0 }}
                animate={{
                  x: orbitPath.map((p) => p.x),
                  y: orbitPath.map((p) => p.y),
                  opacity: 1,
                }}
                transition={{
                  x: { duration: orbitDuration, repeat: Infinity, ease: "linear" },
                  y: { duration: orbitDuration, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 0.6, delay: index * 0.1 },
                }}
              >
                  <motion.div
                    className="relative cursor-pointer"
                    style={{
                      width: "200px",
                      height: "70px",
                      transformStyle: "preserve-3d",
                    }}
                    onClick={() =>
                      setFlippedCard(flippedCard === index ? null : index)
                    }
                    animate={{
                      rotateY: flippedCard === index ? 180 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.08 }}
                  >
                    {/* FRONT – white pill card */}
                    <div
                      className="absolute inset-0 rounded-[18px] flex items-center gap-3 px-4"
                      style={{
                        backfaceVisibility: "hidden",
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.6)",
                        boxShadow: "0 4px 24px rgba(180,120,60,0.15), 0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
                          border: "1px solid rgba(233,120,22,0.2)",
                        }}
                      >
                        {icons[agent.title] || (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E97816" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                        )}
                      </div>
                      <span
                        className="font-heading text-sm font-semibold leading-tight"
                        style={{ color: "#2d1f10" }}
                      >
                        {agent.title}
                      </span>
                    </div>

                    {/* BACK – description */}
                    <div
                      className="absolute inset-0 rounded-[18px] flex items-center justify-center px-4"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(233,120,22,0.3)",
                        boxShadow: "0 4px 24px rgba(180,120,60,0.2), 0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <p
                        className="text-[10px] font-medium leading-snug text-center"
                        style={{ color: "#3d2a15" }}
                      >
                        {agent.desc}
                      </p>
                    </div>
                  </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}