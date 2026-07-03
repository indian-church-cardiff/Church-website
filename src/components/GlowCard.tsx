import React, { useRef, useState } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function GlowCard({
  children,
  className = "",
  glowColor = "rgba(214, 175, 55, 0.15)",
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-primary-light/20 backdrop-blur-md transition-all duration-300 hover:border-accent/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] ${className}`}
    >
      {/* Interactive mouse glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-opacity duration-300"
          style={{
            width: "300px",
            height: "300px",
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        />
      )}

      {/* Decorative accent glow border */}
      <div className="absolute inset-0 border border-accent/0 hover:border-accent/10 rounded-2xl transition-all duration-500 pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}
