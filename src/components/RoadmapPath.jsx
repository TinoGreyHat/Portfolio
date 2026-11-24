import { useMemo } from 'react';

/**
 * Draws a continuous sinuous vertical route through all checkpoints.
 * The route starts at the bottom (level 0) and winds upward to level 20.
 */
export default function RoadmapPath({ points, mapWidth, mapHeight }) {
  const pathData = useMemo(() => {
    if (!points || points.length < 2) return '';

    // Sort by y descending so we build the path from top to bottom,
    // then reverse to render bottom-to-top for the glow animation.
    const sorted = [...points].sort((a, b) => b.y - a.y);

    // Build a smooth Catmull-Rom -> Bezier path.
    let d = `M ${sorted[0].x} ${sorted[0].y}`;
    for (let i = 1; i < sorted.length; i++) {
      const p0 = sorted[i - 2] || sorted[i - 1];
      const p1 = sorted[i - 1];
      const p2 = sorted[i];
      const p3 = sorted[i + 1] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  return (
    <svg
      className="roadmap-route-svg"
      viewBox={`0 0 ${mapWidth} ${mapHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="route-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="var(--cyan)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--purple)" stopOpacity="0.9" />
        </linearGradient>
        <filter id="route-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base dim route */}
      <path
        className="roadmap-route-base"
        d={pathData}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glowing active route */}
      <path
        className="roadmap-route-glow"
        d={pathData}
        fill="none"
        stroke="url(#route-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#route-glow)"
      />

      {/* Animated flow dashes */}
      <path
        className="roadmap-route-flow"
        d={pathData}
        fill="none"
        stroke="var(--text-main)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 28"
        strokeOpacity="0.5"
      />
    </svg>
  );
}
