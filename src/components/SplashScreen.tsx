import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const scanLines = [
  "INITIALIZING UAV RECON SYSTEMS...",
  "SCANNING NETWORK PERIMETER...",
  "DETECTING THREAT SIGNATURES...",
  "AI ENGINE CALIBRATING...",
  "PHISHING VECTORS ANALYZED...",
  "SYSTEM READY — ALL CLEAR",
];

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [radarAngle, setRadarAngle] = useState(0);

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

  useEffect(() => {
    const raf = { id: 0 };
    const spin = () => {
      setRadarAngle((a) => a + 2);
      raf.id = requestAnimationFrame(spin);
    };
    raf.id = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf.id);
  }, []);

  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "linear-gradient(hsl(230 80% 62%) 1px, transparent 1px), linear-gradient(90deg, hsl(230 80% 62%) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />

          {/* Scan line sweep */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ y: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_20px_hsl(230_80%_62%/0.3)]"
            />
          </div>

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* UAV Radar */}
            <div className="relative w-56 h-56">
              {/* Concentric rings */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-primary/10"
                  style={{
                    inset: `${i * 28}px`,
                  }}
                />
              ))}
              {/* Radar sweep */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from ${radarAngle}deg, transparent 0deg, hsl(230 80% 62% / 0.2) 40deg, transparent 80deg)`,
                }}
              />
              {/* Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-primary/10" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-[1px] bg-primary/10" />
              </div>
              {/* Blips */}
              {[
                { top: "25%", left: "60%", delay: 0.5 },
                { top: "65%", left: "30%", delay: 1.2 },
                { top: "40%", left: "75%", delay: 2.0 },
                { top: "70%", left: "65%", delay: 0.8 },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                  transition={{ delay: b.delay, duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                  className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(230_80%_62%/0.6)]"
                  style={{ top: b.top, left: b.left }}
                />
              ))}
              {/* Center shield */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 rounded-full bg-background/80 flex items-center justify-center shadow-[0_0_30px_hsl(230_80%_62%/0.3)]"
                >
                  <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                </motion.div>
              </div>
            </div>

            {/* Brand */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold tracking-tight mb-1">Phishing Detect & Protect</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">UAV Threat Scanner</p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64">
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-brand rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-mono text-primary">{Math.min(Math.round(progress), 100)}%</span>
                <span className="text-[10px] font-mono text-muted-foreground">SCANNING</span>
              </div>
            </div>

            {/* Terminal output */}
            <div className="w-72 h-24 rounded-lg border border-border/50 bg-card/40 p-3 overflow-hidden font-mono text-[10px]">
              {scanLines.slice(0, currentLine + 1).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${i === currentLine ? "text-primary" : "text-muted-foreground/50"}`}
                >
                  <span className="text-success mr-1.5">▸</span>
                  {line}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Corner HUD elements */}
          {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8`}>
              <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-4 h-[1px] bg-primary/20`} />
              <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-[1px] h-4 bg-primary/20`} />
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
