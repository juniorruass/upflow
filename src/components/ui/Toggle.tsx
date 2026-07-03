"use client";

import { motion } from "framer-motion";

export default function Toggle({
  checked,
  onChange,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className="relative h-6 w-11 shrink-0 rounded-[99px] transition-colors duration-200"
      style={{ backgroundColor: checked ? "var(--accent)" : "var(--bg-elevated-2)" }}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-text-primary"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ duration: 0.25, ease: [0.34, 1.26, 0.64, 1] }}
      />
    </button>
  );
}
