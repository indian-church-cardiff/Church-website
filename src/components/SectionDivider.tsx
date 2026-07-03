
interface SectionDividerProps {
  className?: string;
  showCross?: boolean;
}

export default function SectionDivider({
  className = "",
  showCross = true,
}: SectionDividerProps) {
  return (
    <div className={`flex items-center justify-center my-16 px-4 ${className}`}>
      <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-r from-transparent to-accent/40" />
      {showCross ? (
        <div className="mx-6 text-accent/70 relative flex items-center justify-center">
          {/* Simple Cross Motif */}
          <svg
            className="w-8 h-8 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)] text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Vertical beam */}
            <line x1="12" y1="3" x2="12" y2="21" />
            {/* Top short horizontal bar (tablet) */}
            <line x1="9.5" y1="6" x2="14.5" y2="6" />
            {/* Middle long horizontal bar */}
            <line x1="6" y1="10" x2="18" y2="10" />
            {/* Bottom slanted footrest bar */}
            <line x1="9.5" y1="17" x2="14.5" y2="15" />
          </svg>
        </div>
      ) : (
        <div className="w-2 h-2 mx-4 rounded-full bg-accent/40 rotate-45" />
      )}
      <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-l from-transparent to-accent/40" />
    </div>
  );
}
