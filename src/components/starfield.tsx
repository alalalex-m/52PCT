import { useEffect, useRef } from "react";

interface StarfieldProps {
  enabled: boolean;
}

export function Starfield({ enabled }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let raf: number;
    const stars = Array.from({ length: 140 }, () => ({ 
      x: Math.random(), 
      y: Math.random(), 
      r: Math.random() * 1.2 + 0.2, 
      v: Math.random() * 0.0006 + 0.0002 
    }));
    
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, 800);
    }
    
    function tick(t: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const s of stars) {
        s.y += s.v;
        if (s.y > 1) s.y = 0; // 循环
        
        ctx.globalAlpha = 0.5 + Math.sin(t / 500 + s.x * 10) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#f43f5e"; // 玫瑰色光芒
        ctx.shadowColor = "#fb7185";
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      
      raf = requestAnimationFrame(tick);
    }
    
    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      try {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      } catch {}
    };
  }, [enabled]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`pointer-events-none fixed inset-0 z-0 ${enabled ? "opacity-100" : "opacity-0"}`} 
    />
  );
} 