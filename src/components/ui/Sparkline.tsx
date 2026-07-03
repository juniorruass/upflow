export default function Sparkline({
  data,
  flat = false,
  width = 96,
  height = 28,
  color = "var(--accent-bright)",
}: {
  data: number[];
  flat?: boolean;
  width?: number;
  height?: number;
  color?: string;
}) {
  const values = flat ? data.map(() => 0) : data;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });

  const path = flat
    ? `M0,${height / 2} L${width},${height / 2}`
    : `M${points.join(" L")}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path
        d={path}
        stroke={flat ? "var(--text-faint)" : color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
