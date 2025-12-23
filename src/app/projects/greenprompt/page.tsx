"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./greenprompt.css";

// --- Neuron Background (Enhanced with Glow) ---
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
    }));

    function animate() {
      if (!context || !canvas) return;
      context.clearRect(0, 0, width, height);
      const color = darkMode ? "#ffffff" : "#000000";
      
      for (let i = 0; i < neurons.length; i++) {
        const n1 = neurons[i];
        for (let j = i + 1; j < neurons.length; j++) {
          const n2 = neurons[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150 * dpr) {
            context.beginPath();
            context.strokeStyle = color;
            context.globalAlpha = (1 - dist / (150 * dpr)) * 0.2;
            context.lineWidth = 0.8 * dpr;
            context.moveTo(n1.x, n1.y);
            context.lineTo(n2.x, n2.y);
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(n1.x, n1.y, n1.r * dpr, 0, Math.PI * 2);
        context.fillStyle = color;
        context.globalAlpha = 0.6;
        // Adding glow to points
        context.shadowBlur = 10;
        context.shadowColor = color;
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

export default function GreenPromptPage() {
  return (
    <main className="greenprompt-page">
      <NeuronBackground darkMode={true} />

      <div className="content-container">
        <div className="greenprompt-inner">
          <section className="greenprompt-left">
            <p className="greenprompt-year">2025</p>
            <h1 className="greenprompt-title">GREENPROMPT</h1>
            <p className="greenprompt-tagline">
              “Grammarly for AI prompts” — an AI‑powered platform that makes every token count.
            </p>
            <a href="#" className="live-link-btn">LIVE LINK</a>

            <div className="hero-image-container">
              {/* Replace '/greenbrain.png' with your actual image path */}
              <div className="image-overlay-card">
                 <div className="placeholder-text">PROJECT PREVIEW</div>
              </div>
            </div>
          </section>

          <section className="greenprompt-right">
            <div className="info-block">
              <h2 className="section-heading">DESCRIPTION</h2>
              <p className="body-text">
                GreenPrompt is an AI‑powered prompt optimization platform designed to reduce 
                token wastage and minimize environmental impact through efficient LLM processing.
              </p>
            </div>

            <div className="greenprompt-columns">
              <div className="info-block">
                <h3 className="subheading">TECH STACK</h3>
                <ul className="custom-list">
                  <li>Next.js / React</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div className="info-block">
                <h3 className="subheading">HIGHLIGHTS</h3>
                <ul className="custom-list">
                  <li>Real‑time optimization</li>
                  <li>Token‑usage analytics</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}