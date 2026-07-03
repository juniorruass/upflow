"use client";

import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, durationMs = 1100) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }

    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, durationMs]);

  return value;
}

export default function MetricCard({
  label,
  value,
  suffix,
  delta,
}: {
  label: string;
  value: number;
  suffix?: string;
  delta?: { value: string; direction: "up" | "down" | "neutral"; tone?: "positive" | "warning" };
}) {
  const animatedValue = useCountUp(value);

  const deltaColor =
    delta?.tone === "warning" ? "var(--amber)" : delta?.tone === "positive" ? "var(--success)" : "var(--text-dim)";

  return (
    <div className="rounded-[14px] border border-border bg-bg-elevated p-5 transition-colors duration-200 hover:border-border-hover">
      <p className="font-body text-sm text-text-dim">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold text-text-primary">
          {animatedValue}
          {suffix}
        </span>
        {delta && (
          <span className="text-xs font-medium" style={{ color: deltaColor }}>
            {delta.direction === "up" ? "↑" : delta.direction === "down" ? "↓" : ""} {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}
