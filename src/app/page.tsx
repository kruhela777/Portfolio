"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./loader.css";
import { Honk, Orbitron } from "next/font/google";

const honk = Honk({ subsets: ["latin"], weight: "400" });
const orbitron = Orbitron({ subsets: ["latin"], weight: "700" });

function useTypewriter(text: string, delay: number = 80) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    let active = true;
    function step() {
      if (!active) return;
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
        setTimeout(step, delay);
      }
    }
    step();
    return () => { active = false; };
  }, [text, delay]);
  return displayed;
}

export default function LoaderPage() {
  const router = useRouter();

  const [screen, setScreen] = useState<"start" | "loader" | "kr" | "typing">("start");
  const [count, setCount] = useState(0);
  const [isWhiteMode, setIsWhiteMode] = useState(false);
  const [krVisible, setKrVisible] = useState(true);
  const [ballsVisible, setBallsVisible] = useState(true);

  const ballsMovingApartRef = useRef(false);
  const neuronCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- TYPEWRITER LOGIC ---
  const fullName = "KRITIKA RUHELA";
  const typedText = useTypewriter(screen === "typing" ? fullName : "");

  // Play/pause loader audio based on loader visibility
  useEffect(() => {
    // Play audio if on loader, kr, or typing screens (not start or after navigation)
    if (["loader", "kr", "typing"].includes(screen)) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
    // Pause audio if leaving loader screens
    return () => {
      if (!["loader", "kr", "typing"].includes(screen) && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [screen]);

  // Ensure audio is stopped on route change
  useEffect(() => {
    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    router.prefetch && router.prefetch("/home"); // ensure page is ready
    return stopAudio;
  }, [router]);

  // Route to /home after typing is finished and after 1 second pause
  useEffect(() => {
    if (screen === "typing" && typedText === fullName) {
      const timeout = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        router.push("/home");
      }, 1000); // 1 second
      return () => clearTimeout(timeout);
    }
  }, [screen, typedText, router]);

  // Loader progress logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (screen === "loader") {
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsWhiteMode(true);
              setScreen("kr");
              setKrVisible(true);
              setBallsVisible(true);
              ballsMovingApartRef.current = false;
            }, 700);
            return 100;
          }
          return prev + 1;
        });
      }, 20);
    }
    return () => clearInterval(interval);
  }, [screen]);

  // Neuron BG animation
  useEffect(() => {
    const canvas = neuronCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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
    const randomDir = () => Math.random() * 1.2 - 0.6;
    const createNeuron = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: randomDir(),
      vy: randomDir(),
      radius: Math.random() * 2 + 1.3,
    });
    const neurons = Array.from({ length: 60 }, createNeuron);
    function animate() {
      ctx.clearRect(0, 0, width, height);
      const color = isWhiteMode ? "black" : "white";
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
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
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * dpr, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
        n.x += n.vx;
        n.y += n.vy;
        if (n.x <= 0 || n.x >= width) n.vx *= -1;
        if (n.y <= 0 || n.y >= height) n.vy *= -1;
      }
      requestAnimationFrame(animate);
    }
    animate();
    return () => window.removeEventListener("resize", resize);
  }, [isWhiteMode]);

  // Ball animation, removal, moving apart, typing screen trigger
  useEffect(() => {
    if ((screen !== "kr" && screen !== "typing") || !ballsVisible) return;
    const canvas = ballsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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
    const ballRadius = 46 * dpr;
    const KRcenterX = width / 2;
    const KRcenterY = height / 2;
    const KRWidth = 190 * dpr;
    let leftBall = { x: -ballRadius, y: KRcenterY, vx: 3.0 * dpr, vy: 0 };
    let rightBall = { x: width + ballRadius, y: KRcenterY, vx: -3.0 * dpr, vy: 0 };
    let leftBouncing = false;
    let rightBouncing = false;
    let bounceFrame = 0;
    let collisionPhase = false;
    let removingPhase = false;
    let movingApartFrame = 0;
    function animateBalls() {
      ctx.clearRect(0, 0, width, height);
      if (!ballsMovingApartRef.current) {
        if (!leftBouncing) {
          if (leftBall.x + ballRadius < KRcenterX - KRWidth / 2) {
            leftBall.x += leftBall.vx;
          } else {
            leftBouncing = true;
          }
        } else if (!collisionPhase) {
          bounceFrame++;
          leftBall.x -= leftBall.vx * Math.exp(-bounceFrame / 18);
          leftBall.y += Math.sin(bounceFrame / 11) * 2 * dpr;
        }
        if (!rightBouncing) {
          if (rightBall.x - ballRadius > KRcenterX + KRWidth / 2) {
            rightBall.x += rightBall.vx;
          } else {
            rightBouncing = true;
          }
        } else if (!collisionPhase) {
          bounceFrame++;
          rightBall.x -= rightBall.vx * Math.exp(-bounceFrame / 18);
          rightBall.y -= Math.sin(bounceFrame / 11) * 2 * dpr;
        }
        if (leftBouncing && rightBouncing && !collisionPhase) {
          if (bounceFrame > 52) collisionPhase = true;
        }
        if (collisionPhase && !removingPhase) {
          leftBall.x += 4.2 * dpr;
          rightBall.x -= 4.2 * dpr;
          if (
            leftBall.x + ballRadius >= KRcenterX - KRWidth / 2 &&
            rightBall.x - ballRadius <= KRcenterX + KRWidth / 2
          ) {
            removingPhase = true;
            setKrVisible(false);
            ballsMovingApartRef.current = true;
            setScreen("typing");
          }
        }
      } else {
        movingApartFrame++;
        leftBall.x -= 5.0 * dpr;
        rightBall.x += 5.0 * dpr;
        if (movingApartFrame > 68) {
          setBallsVisible(false);
        }
      }
      if (ballsVisible) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(leftBall.x, leftBall.y, ballRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.shadowColor = "#222";
        ctx.shadowBlur = 18 * dpr;
        ctx.globalAlpha = 0.92;
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.arc(rightBall.x, rightBall.y, ballRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.shadowColor = "#222";
        ctx.shadowBlur = 18 * dpr;
        ctx.globalAlpha = 0.92;
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(animateBalls);
    }
    animateBalls();
    return () => window.removeEventListener("resize", resize);
  }, [screen, ballsVisible]);

  return (
    <div
      className={`loader-container ${honk.className}`}
      style={{
        backgroundColor: isWhiteMode ? "white" : "black",
        transition: "background-color 1s ease",
      }}
    >
      {/* Neuron background */}
      <canvas
        ref={neuronCanvasRef}
        className="neuron-bg-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          background: "transparent",
        }}
      />
      {/* Ball animation canvas */}
      {(screen === "kr" && ballsVisible) || (screen === "typing" && ballsVisible) ? (
        <canvas
          ref={ballsCanvasRef}
          className="balls-canvas"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2,
            pointerEvents: "none",
            background: "transparent",
          }}
        />
      ) : null}
      {/* Audio */}
      <audio ref={audioRef} src="/loader-sound.mp3" preload="auto" loop />
      {/* UI */}
      {screen === "start" && (
        <div className="start-screen">
          <button
            className={`letsgo-btn ${orbitron.className}`}
            onClick={() => setScreen("loader")}
          >
            Let's Go
          </button>
        </div>
      )}
      {screen === "loader" && (
        <div className="loading-screen">
          <h1 className="loading-text">{count}%</h1>
        </div>
      )}
      {screen === "kr" && krVisible && (
        <div className="initials-screen">
          <h1 className="initials-text black-kr" style={{ opacity: krVisible ? 1 : 0 }}>
            KR
          </h1>
        </div>
      )}
      {screen === "typing" && (
        <div className="initials-screen">
          <h1 className="typewriter-text">
            {typedText}
          </h1>
        </div>
      )}
    </div>
  );
}
