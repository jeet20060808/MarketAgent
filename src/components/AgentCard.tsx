// 
"use client";

import React from "react";
import styled from "styled-components";
import {
  Search,
  BriefcaseBusiness,
  Lightbulb,
  DollarSign,
  ShieldCheck,
  Megaphone,
  Code2,
  Building2,
} from "lucide-react";
const cards = [
  {
    name: "Market Research",
    icon: Search,
    color: "242, 156, 56",
  },
  {
    name: "Product Manager",
    icon: BriefcaseBusiness,
    color: "242, 156, 56",
  },
  {
    name: "Startup Advisor",
    icon: Lightbulb,
    color: "242, 156, 56",
  },
  {
    name: "Financial Analyst",
    icon: DollarSign,
    color: "242, 156, 56",
  },
  {
    name: "Risk Analyst",
    icon: ShieldCheck,
    color: "242, 156, 56",
  },
  {
    name: "Marketing",
    icon: Megaphone,
    color: "242, 156, 56",
  },
  {
    name: "Engg.",
    icon: Code2,
    color: "242, 156, 56",
  },
  {
    name: "Architect",
    icon: Building2,
    color: "242, 156, 56",
  },
];

const Card = () => {
  return (
    <StyledWrapper>
    
      <div className="wrapper">
      <div className="topContent">
  <h2>Build Smarter with Specialized AI Agents</h2>
</div>
        <div
          className="inner"
          style={
            {
              "--quantity": cards.length,
            } as React.CSSProperties
          }
        >
          {cards.map((card, index) => {
  const Icon = card.icon;

  return (
    <div
      key={index}
      className="card"
      style={
        {
          "--index": index,
          "--color-card": card.color,
        } as React.CSSProperties
      }
    >
      <div className="img">
  <div className="content">
    <div className="icon-wrapper">
      <Icon size={30} strokeWidth={2.2} />
    </div>

    <div className="text">
      <h3>{card.name}</h3>
      <p>Agent</p>
    </div>
  </div>
</div>
    </div>
  );
})}

        </div>
        <div className="bottomContent">
  <p>
    From market research to engineering, every specialized
    agent contributes its expertise to help you move from
    idea to launch faster and with greater confidence.
  </p>
</div>
      </div>
      
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
 width: 100%;
padding: 30px 24px 50px;
min-height: 900px;
box-sizing: border-box;

.wrapper {
  width: 100%;
  max-width: 1900px;
  height: 850px;

  margin: 0 auto;

  background:
    linear-gradient(
      to top,
      rgba(242, 156, 56, 0.35) 0%,
      rgba(211, 138, 54, 0.18) 20%,
      rgb(233, 195, 159) 60%,
      rgba(243, 221, 201, 1) 100%
    );

  border: 8px solid rgb(180, 176, 176);
  border-radius: 34px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  padding-top: 60px;

  position: relative;
  overflow: hidden;
}
  .wrapper::before {
  content: "";

  position: absolute;
  inset: 0;

  background-image:
    linear-gradient(
      90deg,
      rgba(150, 150, 150, 0.18) 1px,
      transparent 1px
    );

  background-size: 60px 100%;

  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0)
  );

  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0)
  );

  pointer-events: none;
}
  .wrapper::after {
  content: "";

  position: absolute;
  inset: 0;

  background-image:
    linear-gradient(rgba(150,150,150,.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(150,150,150,.12) 1px, transparent 1px);

  background-size: 60px 60px;

  mask-image: radial-gradient(circle at center, black 45%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 45%, transparent 100%);

  pointer-events: none;
}

  .inner {
    --w: 150px;
    --h: 200px;
    --translateZ: calc((var(--w) + var(--h)) + 30px);
    --rotateX: -15deg;
    --perspective: 1200px;

    position: absolute;
    top: 220px;
    width: var(--w);
    height: var(--h);

    transform-style: preserve-3d;
    transform: perspective(var(--perspective));
    animation: rotating 20s linear infinite;
  }

  @keyframes rotating {
    from {
      transform: perspective(var(--perspective))
        rotateX(var(--rotateX))
        rotateY(0deg);
    }
    to {
      transform: perspective(var(--perspective))
        rotateX(var(--rotateX))
        rotateY(360deg);
    }
  }

  .card {
  position: absolute;
  inset: 0;

  overflow: hidden;
  border-radius: 22px;

  border: 1px solid rgba(25, 23, 23, 0.35);

  transform:
    rotateY(calc((360deg / var(--quantity)) * var(--index)))
    translateZ(var(--translateZ));

  transition: .3s;
}

  .img {
  width: 100%;
  height: 100%;
  border-radius: 22px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(255,255,255,.08);

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  border: 1px solid rgba(255,255,255,.18);

  box-shadow:
    inset 0 1px 1px rgba(255,255,255,.15),
    0 8px 35px rgba(0,0,0,.18),
    0 0 18px rgba(242,156,56,.15);
}

  .card:hover {
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
      translateZ(calc(var(--translateZ) + 20px));
  }
;
.img {
  width: 100%;
  height: 100%;
  border-radius: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,0.45);

  box-shadow: none;
}

.content{
    width:100%;
    height:100%;

    display:flex;
    align-items:center;
    justify-content:center;

    gap:16px;

    padding:18px;
}
.icon{
  font-size:48px;
  margin-bottom:18px;
}

.content h3{
  color:white;
  font-size:24px;
  font-weight:700;
  line-height:1.3;
}
  .icon-wrapper{
    width:50px;
    height:50px;

    border-radius:50%;

    display:flex;
    align-items:center;
    justify-content:center;

    background:rgba(255,255,255,.55);

    color:#F29C38;

    border:1px solid rgba(255,255,255,.6);

    flex-shrink:0;
}
    .text{
    display:flex;
    flex-direction:column;
    justify-content:center;
}
    .text h3{
    margin:0;

    font-size:15px;
    font-weight:600;

    color:#232323;

    line-height:1.25;
}
    .text p{
    margin-top:2px;

    font-size:13px;

    color:#555;

    font-weight:500;
}
   .topContent {
  width: 100%;
  text-align: center;
  margin-bottom: 100px;
  z-index: 10;
  position: relative;
}

.topContent h2{
    font-family:"Times New Roman", Times, serif;

    font-size:50px;
    font-weight:600;
    color:#111;
    line-height:1;
    margin-top:2px;
}
    .bottomContent{
    margin-top:90px;

    width:520px;

    text-align:left;
}

.bottomContent {
  position: absolute;

  left: 70px;
  bottom: 60px;

  width: 520px;

  text-align: left;
}

.bottomContent p {
  font-size: 18px;
  line-height: 1.8;
  color: #555;
}
`
export default Card;