"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import "./greenprompt.css";


// --- Neuron Background (Enhanced with Glow and Mixed Colors) ---
function NeuronBackground({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth * dpr;
    let height = window.innerHeight * dpr;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth * dpr;
      height = window.innerHeight * dpr;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);

    const neurons = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 2 + 1,
      color: Math.random() < 0.5 ? "#ffffff" : "#00ff88",
    }));

    function animate() {
      if (!context || !canvas) return;
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < neurons.length; i++) {
        const n1 = neurons[i];

        for (let j = i + 1; j < neurons.length; j++) {
          const n2 = neurons[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150 * dpr) {
            context.beginPath();
            context.strokeStyle = n1.color;
            context.globalAlpha = (1 - dist / (150 * dpr)) * 0.2;
            context.lineWidth = 0.8 * dpr;
            context.moveTo(n1.x, n1.y);
            context.lineTo(n2.x, n2.y);
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(n1.x, n1.y, n1.r * dpr, 0, Math.PI * 2);
        context.fillStyle = n1.color;
        context.globalAlpha = 0.9;
        context.shadowBlur = 12;
        context.shadowColor = n1.color;
        context.fill();
        context.shadowBlur = 0;

        n1.x += n1.vx;
        n1.y += n1.vy;
        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;
      }

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, [darkMode]);

  return <canvas ref={canvasRef} className="neuron-bg-canvas" />;
}


// --- Green circular cursor controller ---
function GreenCursorController() {
  useEffect(() => {
    const el = document.getElementById("green-cursor");
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return null;
}


export default function GreenPromptPage() {
  return (
    <main className="greenprompt-page">
      <NeuronBackground darkMode={true} />

      {/* Custom bright green border cursor */}
      <div id="green-cursor" className="green-cursor" />
      <GreenCursorController />

      <div className="content-container">
        <div className="greenprompt-inner">
          <section className="greenprompt-left">
            <p className="greenprompt-year">2025</p>

            <div className="title-row">
              <h1 className="greenprompt-title">GREENPROMPT</h1>
              <a
                href="https://github.com/kruhela777/GreenPrompt"
                target="_blank"
                rel="noopener noreferrer"
                className="github-icon-link"
                aria-label="Open GreenPrompt GitHub repository"
              >
                <FaGithub />
              </a>
            </div>

            <p className="greenprompt-tagline">
              “Grammarly for Prompts” — a cross‑platform AI prompt optimization
              platform that reduces token usage, computational waste, and carbon footprint in real time.
            </p>

            <div className="hero-video-container">
              <video
                className="project-video"
                autoPlay
                loop
                muted
                playsInline
                poster="/greenprompt-poster.jpg"
              >
                <source src="/videos/greenprompt-video.mp4" type="video/mp4" />
              </video>
            </div>
          </section>

          <section className="greenprompt-right">
            <div className="info-block">
              <h2 className="section-heading">DESCRIPTION</h2>
              <p className="body-text">
                GreenPrompt uses machine learning to analyze and restructure prompts so LLM
                calls become more efficient, cheaper, and greener.
              </p>
              <p className="body-text">
                A built‑in sustainability dashboard tracks cost, energy, and CO₂ savings
                while serving optimized prompts to APIs like GPT, Claude, Gemini, and Perplexity.
              </p>
            </div>

            <div className="greenprompt-columns">
              <div className="info-block">
                <h3 className="subheading">TECH STACK</h3>
                <ul className="custom-list">
                  <li>Python + ML models</li>
                  <li>React.js / Next.js</li>
                  <li>MySQL database</li>
                  <li>CO₂ impact &amp; metrics</li>
                </ul>
              </div>

              <div className="info-block">
                <h3 className="subheading">HIGHLIGHTS</h3>
                <ul className="custom-list">
                  <li>Real‑time prompt optimization</li>
                  <li>Lower token usage &amp; cost</li>
                  <li>Energy and CO₂ savings dashboard</li>
                  <li>Multi‑LLM API support (GPT, Claude, Gemini, Perplexity)</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
