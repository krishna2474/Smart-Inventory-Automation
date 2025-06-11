"use client";
import { useEffect, useState } from "react";

export default function BackgroundAnimation() {
  const [dots, setDots] = useState<Array<{ id: number; x: number; y: number }>>(
    []
  );

  useEffect(() => {
    const newDots = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
          style={{
            top: `${dot.y}vh`,
            left: `${dot.x}vw`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}
    </div>
  );
}
