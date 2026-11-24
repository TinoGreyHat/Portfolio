import { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Check, Lock, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  COMPLETED: {
    icon: Check,
    color: 'var(--accent)',
    glow: 'var(--accent-glow)',
    labelKey: 'roadmap.node.status.completed',
  },
  IN_PROGRESS: {
    icon: Clock,
    color: 'var(--cyan)',
    glow: 'var(--cyan-glow)',
    labelKey: 'roadmap.node.status.inProgress',
  },
  FUTURE: {
    icon: Lock,
    color: 'var(--text-muted)',
    glow: 'transparent',
    labelKey: 'roadmap.node.status.future',
  },
};

export default function RoadmapNode({ level, isCurrent, onSelect, position }) {
  const { t } = useI18n();
  const [hovered, setHovered] = useState(false);
  const config = STATUS_CONFIG[level.status] || STATUS_CONFIG.FUTURE;
  const Icon = config.icon;
  const isAccessible = level.status !== 'FUTURE';
  const progress = level.progress ?? (level.status === 'COMPLETED' ? 100 : 0);

  const handleClick = () => {
    if (onSelect) onSelect(level);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`checkpoint ${level.status.toLowerCase()} ${isCurrent ? 'is-current' : ''} ${hovered ? 'is-hovered' : ''}`}
      style={{
        left: position.x,
        top: `${position.y}px`,
        '--checkpoint-color': config.color,
        '--checkpoint-glow': config.glow,
      }}
      data-side={position.side}
    >
      <button
        className="checkpoint-button"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onKeyDown={handleKeyDown}
        aria-label={t('roadmap.node.ariaLabel', { level: level.levelNumber, title: level.title, status: t(config.labelKey), isCurrent })}
      >
        {/* Outer ring */}
        <span className="checkpoint-ring" aria-hidden="true" />
        {/* Inner core */}
        <span className="checkpoint-core" aria-hidden="true">
          <Icon size={18} />
        </span>
        {/* Pulse for current */}
        {isCurrent && <span className="checkpoint-pulse" aria-hidden="true" />}
        {/* Progress ring */}
        {isAccessible && progress > 0 && progress < 100 && (
          <svg className="checkpoint-progress-ring" viewBox="0 0 64 64" aria-hidden="true">
            <circle
              className="checkpoint-progress-circle"
              cx="32" cy="32" r="28"
              strokeDasharray={`${(progress / 100) * 176} 176`}
            />
          </svg>
        )}
      </button>

      {/* Label */}
      <div className="checkpoint-label" aria-hidden="true">
        <span className="checkpoint-level">{t('roadmap.node.levelLabel', { level: String(level.levelNumber).padStart(2, '0') })}</span>
        <span className="checkpoint-title">{level.title}</span>
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div className="checkpoint-tooltip" role="tooltip">
          <p className="checkpoint-tooltip-title">{t('roadmap.node.tooltip.title', { level: String(level.levelNumber).padStart(2, '0'), title: level.title })}</p>
          <p className="checkpoint-tooltip-status" style={{ color: config.color }}>{t(config.labelKey)}</p>
          {isAccessible && level.summary && (
            <p className="checkpoint-tooltip-summary">{level.summary.substring(0, 90)}…</p>
          )}
          <span className="checkpoint-tooltip-action">{t('roadmap.node.tooltip.clickToOpen')}</span>
        </div>
      )}
    </div>
  );
}