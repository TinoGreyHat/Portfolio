/**
 * Floating island SVG decoration for each zone.
 * Each zone has a distinct architectural style matching its theme.
 */
export default function ZoneIsland({ zone }) {
  // Zone color mapping using CSS variables
  const zoneColors = {
    technical: { base: 'var(--accent)', glow: 'var(--accent-glow)' },
    leadership: { base: 'var(--cyan)', glow: 'var(--cyan-glow)' },
    executive: { base: 'var(--purple)', glow: 'var(--purple-glow)' },
  };

  const c = zoneColors[zone] || zoneColors.technical;

  // Building configurations
  const buildingConfigs = {
    technical: [
      { x: 60, w: 26, h: 60, type: 'soc' },
      { x: 100, w: 20, h: 42, type: 'tower' },
      { x: 130, w: 30, h: 72, type: 'soc' },
      { x: 175, w: 18, h: 38, type: 'tower' },
      { x: 200, w: 24, h: 52, type: 'soc' },
    ],
    leadership: [
      { x: 55, w: 30, h: 78, type: 'gov' },
      { x: 100, w: 22, h: 56, type: 'tower' },
      { x: 135, w: 34, h: 90, type: 'gov' },
      { x: 185, w: 20, h: 48, type: 'tower' },
      { x: 215, w: 26, h: 66, type: 'gov' },
    ],
    executive: [
      { x: 50, w: 28, h: 70, type: 'tower' },
      { x: 95, w: 36, h: 100, type: 'skyscraper' },
      { x: 145, w: 24, h: 60, type: 'tower' },
      { x: 180, w: 40, h: 115, type: 'skyscraper' },
      { x: 235, w: 26, h: 76, type: 'tower' },
    ],
  };

  const buildings = buildingConfigs[zone] || buildingConfigs.technical;
  const treePositions = {
    technical: [45, 90, 165, 230],
    leadership: [40, 88, 170, 250],
    executive: [40, 80, 220, 270],
  };
  const trees = treePositions[zone] || treePositions.technical;

  return (
    <svg
      className={`zone-island zone-island-${zone}`}
      viewBox="0 0 300 180"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`island-grad-${zone}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.base} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.base} stopOpacity="0.08" />
        </linearGradient>
        <filter id={`island-glow-${zone}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Floating island base */}
      <ellipse cx="150" cy="150" rx="140" ry="22" fill={c.glow} fillOpacity="0.25" filter={`url(#island-glow-${zone})`} />
      <path
        d="M 15 130 Q 150 90 285 130 L 270 155 Q 150 175 30 155 Z"
        fill={`url(#island-grad-${zone})`}
        stroke={c.base}
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      {/* Island underside spikes */}
      <path d="M 50 150 L 60 172 L 70 152" fill={c.base} fillOpacity="0.2" />
      <path d="M 130 156 L 150 180 L 170 156" fill={c.base} fillOpacity="0.2" />
      <path d="M 225 152 L 240 174 L 252 152" fill={c.base} fillOpacity="0.2" />

      {/* Trees */}
      {trees.map((tx, i) => (
        <g key={`tree-${i}`}>
          <rect x={tx} y={108} width="3" height="14" fill="var(--bg-cyber-tertiary)" />
          <circle cx={tx + 1.5} cy={106} r="8" fill={c.base} fillOpacity="0.35" />
          <circle cx={tx + 1.5} cy={100} r="6" fill={c.base} fillOpacity="0.5" />
        </g>
      ))}

      {/* Buildings */}
      {buildings.map((b, i) => {
        const top = 130 - b.h;
        return (
          <g key={`b-${i}`}>
            <rect
              x={b.x} y={top} width={b.w} height={b.h}
              fill={c.base} fillOpacity="0.18"
              stroke={c.base} strokeOpacity="0.5" strokeWidth="1"
            />
            {/* Windows */}
            {Array.from({ length: Math.floor(b.h / 12) }).map((_, wi) => (
              <rect
                key={wi}
                x={b.x + 4}
                y={top + 6 + wi * 12}
                width={b.w - 8}
                height="4"
                fill={c.base}
                fillOpacity="0.6"
              />
            ))}
            {/* Roof accent */}
            {b.type === 'skyscraper' && (
              <rect x={b.x + b.w / 2 - 2} y={top - 10} width="4" height="10" fill={c.base} fillOpacity="0.7" />
            )}
            {b.type === 'soc' && (
              <circle cx={b.x + b.w / 2} cy={top + 8} r="3" fill={c.base} fillOpacity="0.8">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}
