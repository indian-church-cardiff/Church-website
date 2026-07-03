
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
            className="w-6 h-6 animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Vertical beam */}
            <line x1="12" y1="4" x2="12" y2="20" />
            {/* Horizontal beam */}
            <line x1="7" y1="9" x2="17" y2="9" />
          </svg>
        </div>
      ) : (
        <div className="w-2 h-2 mx-4 rounded-full bg-accent/40 rotate-45" />
      )}
      <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-l from-transparent to-accent/40" />
    </div>
  );
}
