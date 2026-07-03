export default function PulseLine({ active = true }: { active?: boolean }) {
  return (
    <svg
      width="100%"
      height="32"
      viewBox="0 0 240 32"
      fill="none"
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <path
        d="M0,16 L70,16 L82,4 L94,28 L106,16 L160,16 L172,7 L184,25 L196,16 L240,16"
        stroke={active ? "var(--accent-bright)" : "var(--text-faint)"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "pulse-line-path" : undefined}
        style={
          active
            ? { filter: "drop-shadow(0 0 4px var(--accent-bright))" }
            : undefined
        }
      />
    </svg>
  );
}
