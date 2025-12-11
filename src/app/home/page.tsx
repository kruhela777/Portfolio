"use client";
import "./home.css";
import { useEffect, useRef, useState } from "react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { BsFillMoonStarsFill, BsSunFill } from "react-icons/bs";

const LIGHT_IMAGE = "/profile.png";

const typewriterLines = [
  "Hello,",
  "meet the creative",
  "Full Stack Developer",
  "in this era.",
];

function CreativeDeveloperSection(props: { darkMode: boolean }) {
  const imgSrc = "/profile.png";
  return (
    <section className="creative-section">
      <div className="creative-heading-row">
        <span className="creative-title">CREATIVE</span>
        <span className="creative-title-star">✦</span>
        <span className="creative-title">DEVELOPER</span>
      </div>
      <div className="creative-content-row">
        <div className="creative-info">
          <p>/ ART DIRECTION</p>
          <p>/ WEB DESIGN (UX/UI)</p>
          <p>/ WEB DEVELOPMENT</p>
        </div>
        <div className="creative-photo">
          <img src={imgSrc} alt="Developer" />
        </div>
      </div>
      <div className="creative-bio-text">
        <p>
          I’M EXPERIENCED WEB AND UX/UI DESIGNER,
          <br />
          WHO DESIGN MEMORABLE WEB EXPERIENCES FOR
          <br />
          BRANDS OF ALL SIZES
        </p>
      </div>
    </section>
  );
}

function NeuronBackground({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

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

    const randDir = () => Math.random() * 1.2 - 0.6;
    const createNeuron = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: randDir(),
      vy: randDir(),
      r: Math.random() * 2 + 1.2,
    });

    const neuronCount = 60;
    const neurons = Array.from({ length: neuronCount }, createNeuron);

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const color = darkMode ? "white" : "black";

      for (let i = 0; i < neuronCount; i++) {
        for (let j = i + 1; j < neuronCount; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 * dpr) {
            ctx.save();
            ctx.globalAlpha = 0.8 - dist / (120 * dpr);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.6 * dpr;
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      for (const n of neurons) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="neuron-bg-canvas"
      aria-hidden="true"
    />
  );
}

export default function HomePage() {
  // ✅ default dark mode = true
  const [darkMode, setDarkMode] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [display, setDisplay] = useState(["", "", "", ""]);
  const [charIdx, setCharIdx] = useState(0);

  // typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const text = typewriterLines[currentLine];
    if (charIdx < text.length) {
      timeout = setTimeout(() => {
        setDisplay((prev) => {
          const copy = [...prev];
          copy[currentLine] += text[charIdx];
          return copy;
        });
        setCharIdx(charIdx + 1);
      }, 55);
    } else if (currentLine < typewriterLines.length - 1) {
      timeout = setTimeout(() => {
        setCurrentLine(currentLine + 1);
        setCharIdx(0);
      }, 300);
    } else {
      timeout = setTimeout(() => {
        setDisplay(["", "", "", ""]);
        setCurrentLine(0);
        setCharIdx(0);
      }, 1200);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, currentLine]);

  // apply body class, and ensure dark on first render
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <>
      <NeuronBackground darkMode={darkMode} />

      <div className={`navbar-img${darkMode ? " dark" : ""}`}>
        <div className="nav-img-left">
          <div className="nav-img-logo">KR</div>
          <div className="nav-img-logo-divider"></div>
          <div className="nav-img-message typewriter-multiline">
            {display.map((txt, i) => (
              <div key={i}>
                {txt}
                {currentLine === i && <span className="cursor">|</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="nav-img-center">
          <a href="#" className="nav-img-link">
            ABOUT <span className="nav-img-link-arrow">→</span>
          </a>
          <a href="#" className="nav-img-link">
            WORK <span className="nav-img-link-arrow">→</span>
          </a>
          <a href="#" className="nav-img-link">
            CONTACT <span className="nav-img-link-arrow">→</span>
          </a>
        </div>

        <div className="nav-img-icons-group">
          <div className="nav-img-icons-fullheight-divider"></div>
          <div className="nav-img-icons-col">
            <a
              href="https://github.com/YourGitHubUsername"
              target="_blank"
              className="nav-img-icon"
            >
              <FaGithub />
            </a>
            <div className="nav-img-hr-full"></div>
            <a
              href="https://www.linkedin.com/in/ruhela-kritika/"
              target="_blank"
              className="nav-img-icon"
            >
              <FaLinkedinIn />
            </a>
          </div>
          <div className="nav-img-icons-fullheight-divider nav-img-icons-spacer-divider"></div>
          <button
            className="nav-img-icon theme-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? <BsSunFill /> : <BsFillMoonStarsFill />}
          </button>
        </div>

        <div className="nav-img-right">
          <div className="nav-img-right-top">Coding globally from India.</div>
          <div className="nav-img-right-bottom">
            Available for work → <span className="nav-img-hire">Hire me</span>
          </div>
        </div>
      </div>

      <div className="page-content">
        <CreativeDeveloperSection darkMode={darkMode} />
      </div>

      <div className="ican-row">
  <div className={`big-i-can ${darkMode ? "dark" : ""}`}>I can</div>

  <div className="ican-window">
    <div className="ican-track">
      <span>develop.</span>
      <span>innovate.</span>
      <span>design.</span>
      <span>build.</span>
      <span>prototype.</span>
      <span>collaborate.</span>
      {/* repeat first word for smooth loop */}
      <span>develop.</span>
    </div>
  </div>
</div>

    </>
  );
}
