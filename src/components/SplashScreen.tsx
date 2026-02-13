import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo_obsidian_root.svg";

const scanLines = [
  { text: "INITIALIZING SECURITY MODULES", status: "ok" },
  { text: "SCANNING NETWORK PERIMETER", status: "ok" },
  { text: "LOADING THREAT SIGNATURES", status: "ok" },
  { text: "AI ENGINE CALIBRATING", status: "ok" },
  { text: "PHISHING VECTORS ANALYZED", status: "ok" },
  { text: "SYSTEM READY", status: "ready" },
];

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return p + 1.2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor((progress / 100) * scanLines.length), scanLines.length - 1);
    setCurrentLine(idx);
  }, [progress]);

  // Particle network background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56,189,248,0.15)";
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56,189,248,${0.04 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* Background Gradient for Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/3 via-background to-background" />

          {/* Particle canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Radial glow layers */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[hsl(190_85%_48%/0.02)] rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[hsl(260_70%_55%/0.02)] rounded-full blur-[100px] pointer-events-none" />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-6">
            
            {/* 3D Octahedron Crystal Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="crystal-container relative w-72 h-72 mb-6 flex items-center justify-center"
            >
              {/* Spinning Scanner Ring */}
              <div className="crystal-scanner"></div>
              
              {/* Inner Glow Pulse */}
              <div className="crystal-glow"></div>

              {/* The Crystal (Octahedron) */}
              <div className="crystal-wrapper w-full h-full relative">
                {/* Top Faces */}
                <div className="crystal-face f1"></div>
                <div className="crystal-face f2"></div>
                <div className="crystal-face f3"></div>
                <div className="crystal-face f4"></div>
                {/* Bottom Faces */}
                <div className="crystal-face f5"></div>
                <div className="crystal-face f6"></div>
                <div className="crystal-face f7"></div>
                <div className="crystal-face f8"></div>
                
                {/* Logo Floats Inside */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(0)' }}>
                   {/* Logo Glow Backing */}
                   <div className="absolute w-28 h-28 bg-primary/15 rounded-full blur-xl animate-pulse" />
                   <img src={logo} alt="Logo" className="w-48 h-48 object-contain drop-shadow-[0_0_40px_rgba(56,189,248,0.6)] animate-pulse relative z-10" />
                </div>
              </div>
            </motion.div>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                Obsidian Guard
              </h1>
              <p className="text-sm text-white/25 uppercase tracking-[0.4em] font-medium">Cyber Threat Intelligence</p>
            </motion.div>

            {/* Progress section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-72 md:w-80 mb-8"
            >
              <div className="relative h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-[hsl(220,70%,50%)] to-secondary"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
                {/* Glow on progress tip */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-4 bg-primary/40 blur-md rounded-full"
                  style={{ left: `calc(${Math.min(progress, 100)}% - 16px)` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-xs font-mono text-primary font-medium">{Math.min(Math.round(progress), 100)}%</span>
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  {progress < 30 ? "Connecting" : progress < 60 ? "Scanning" : progress < 90 ? "Analyzing" : "Finalizing"}
                </span>
              </div>
            </motion.div>

            {/* Terminal output */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-72 md:w-96 rounded-lg border border-white/[0.05] bg-white/[0.01] backdrop-blur-sm overflow-hidden"
            >
              {/* Terminal header */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.04]">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <span className="ml-2 text-[9px] font-mono text-white/15 uppercase tracking-widest">Security Console</span>
              </div>
              <div className="p-4 font-mono text-[11px] space-y-1.5 h-[7.5rem] overflow-hidden">
                {scanLines.slice(0, currentLine + 1).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center gap-2 ${
                      i === currentLine ? "text-white/70" : "text-white/20"
                    }`}
                  >
                    <span className="text-primary text-xs">›</span>
                    <span className="flex-1">{line.text}</span>
                    {i < currentLine && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                          line.status === "ready"
                            ? "text-primary bg-primary/10"
                            : "text-white/30 bg-white/[0.03]"
                        }`}
                      >
                        {line.status === "ready" ? "READY" : "OK"}
                      </motion.span>
                    )}
                    {i === currentLine && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-1.5 h-3.5 bg-primary/60 rounded-sm"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Corner brackets */}
          {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8`}>
              <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-4 h-[1px] bg-white/[0.06]`} />
              <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-[1px] h-4 bg-white/[0.06]`} />
            </div>
          ))}

          {/* Bottom floating version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/10 tracking-widest"
          >
            v1.0.0 — THREAT INTELLIGENCE PLATFORM
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
