export function Logo({ className = "w-8 h-8", strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Geometric "Citadel" / Fortress abstract shape */}
            <path d="M12 3L4 9v12h16V9l-8-6z" />
            <path d="M9 21V12h6v9" />
            <path d="M4 9h16" />
        </svg>
    );
}
