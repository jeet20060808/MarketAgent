"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Aurora from "./Aurora/Aurora";

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

export default function AgentsSection() {
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
            className="absolute rounded-full bg-[#FFB347]/40 border- border-[#f2eeeb]"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              top: b.top,
              zIndex: 5,
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
  const orbitRadius = 341;
  const orbitSteps = 80;

  const buildOrbitPath = (index: number) => {
    const phase = (index / agents.length) * Math.PI * 2;

    return Array.from({ length: orbitSteps + 1 }, (_, step) => {
      const progress = (step / orbitSteps) * Math.PI * 2;
      const angle = phase - progress;

      return {
        x: Math.cos(angle) * orbitRadius,
        y: Math.sin(angle) * orbitRadius,
      };
    });
  };

  const renderAgentCard = (
    agent: (typeof agents)[number],
    index: number
  ) => {
    const orbitPath = buildOrbitPath(index);
  
    return (
      <motion.div
        key={agent.title}
        className="absolute left-1/2 top-1/2 h-[135px] w-[260px] -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: 1200 }}
      >
        <motion.div
          initial={{ x: orbitPath[0].x, y: orbitPath[0].y }}
          animate={{
            x: orbitPath.map((p) => p.x),
            y: orbitPath.map((p) => p.y),
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative h-full w-full"
        >
          <motion.div
            className="relative h-full w-full cursor-pointer"
            onClick={() =>
              setFlippedCard(flippedCard === index ? null : index)
            }
            animate={{
              rotateY: flippedCard === index ? 180 : 0,
            }}
            transition={{ duration: 0.6 }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[22px]"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              <div
                className="
                  relative
                  z-20
                  h-full
                  rounded-[22px]
                  border
                  border-black/5
                  bg-white
                  shadow-sm
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-2.5
                  p-5
                "
              >
                {icons[agent.title] && (
                  <div className="flex items-center justify-center p-2 rounded-xl bg-orange-500/10 text-orange-500 mb-0.5">
                    {icons[agent.title]}
                  </div>
                )}
                <h3 className="text-lg font-bold text-zinc-900 text-center">
                  {agent.title}
                </h3>
              </div>
            </div>
            {/* BACK */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[22px]"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="h-full rounded-[22px] border border-orange-500/20 bg-white shadow-sm flex items-center justify-center p-5">
                <p className="font-sans font-medium text-xs text-zinc-700 text-center leading-relaxed">
                  {agent.desc}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };
 

              {/* <div className="absolute inset-0 overflow-hidden rounded-[22px] [transform:rotateY(180deg)] [backface-visibility:hidden]">

  <motion.div
    className="absolute -inset-20 opacity-0 group-hover:opacity-100"
    animate={{
  rotate: [0, 360],
  scale: [1, 1.15, 1],
}}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "linear",
      delay: index * 0.3,
    }}
  >
   <div className="absolute left-[-40px] top-[-40px] h-72 w-72 rounded-full bg-orange-500 blur-[130px] opacity-80" />
<div className="absolute right-[-40px] bottom-[-40px] h-72 w-72 rounded-full bg-yellow-300 blur-[130px] opacity-80" />
  </motion.div>

  <div className="relative z-10 h-full rounded-[22px] border border-orange-500/70 bg-[#141414]/55 backdrop-blur-2xl flex items-center justify-center p-6">
    <p className="font-heading text-base leading-relaxed text-white">
      {agent.desc}
    </p>
  </div>
// </div> */}
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       );
//     };

  return (
    
    <section className="landing-window relative w-full max-w-[1440px] min-h-[calc(100vh-24px)] md:min-h-[calc(100vh-40px)] bg-[#f5dccb] border-[10px] border-[#adacaa] rounded-[28px] md:rounded-[36px] overflow-hidden flex flex-col shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]">
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        {/* <Aurora
          colorStops={["#FF8A00", "#FFB347", "#FFD6A5"]}
          blend={0.45}
          amplitude={1.2}
          speed={0.4}
        /> */}
        <img
  src="/landing/landingbg.jpeg"
  alt="Background"
  className="absolute inset-0 h-full w-full object-cover opacity-40"
/>
      </div>

       <FloatingBubbles />
      {/* Animated Background Glow */}
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full bg-orange-400/20 blur-[140px]"
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

          <p className="font-heading uppercase tracking-[0.3em] text-black mb-4">
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
            className="font-heading text-6xl font-bold text-black mb-6"
          >
            Meet Your AI Agents
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-heading text-lg text-black max-w-2xl mx-auto"
          >
            Specialized agents work together to transform your idea into a
            complete startup plan.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="relative mx-auto h-[620px] md:h-[760px] w-full max-w-[860px]">
          <motion.div
            className="absolute left-1/2 top-1/2 h-[200px] w-[220px] -translate-x-1/2 -translate-y-1/2 md:h-[220px] md:w-[240px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Center robot that cards orbit around (static) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center">
            <Image
              src="/landing/robo10.png"
              alt="Agent robot"
              width={1200}
              height={1500}
              unoptimized
              className="w-[420px] md:w-[720px] h-auto"
              style={{ width: '420px', maxWidth: 'none', mixBlendMode: 'normal', filter: 'none' }}
            />
          </div>

          {agents.map((agent, index) => renderAgentCard(agent, index))}
          {/* {selectedAgent !== null && (
  <motion.div
    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    onClick={() => setSelectedAgent(null)}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={(e) => e.stopPropagation()}
      className="max-w-xl mx-4 rounded-3xl border border-orange-500/30 bg-[#111] p-8"
    >
      <h3 className="text-3xl font-bold text-white mb-4">
        {agents[selectedAgent].title}
      </h3>

      <p className="text-white/80 leading-relaxed">
        {agents[selectedAgent].desc}
      </p>

      <button
        onClick={() => setSelectedAgent(null)}
        className="mt-6 rounded-xl bg-orange-500 px-5 py-2 text-white"
      >
        Close
      </button>
    </motion.div>
  </motion.div> */}
{/* )} */}
        </div>

      </div>
    </section>
  );
}