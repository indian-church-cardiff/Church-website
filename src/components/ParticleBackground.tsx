
export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[10%] left-[20%] w-72 h-72 rounded-full bg-accent/8 blur-[80px] animate-pulse duration-10000"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-accent-light/5 blur-[120px] animate-pulse duration-8000"></div>
      <div className="absolute top-[40%] right-[30%] w-60 h-60 rounded-full bg-accent/5 blur-[90px] animate-pulse duration-12000"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(8)].map((_, i) => {
          const size = Math.random() * 6 + 2;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 15;
          const duration = Math.random() * 20 + 20;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-accent animate-bounce"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity: Math.random() * 0.5 + 0.3,
                filter: "blur(0.5px)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
