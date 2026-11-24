import { useEffect, useRef } from 'react';
import { useI18n } from '../contexts/I18nContext';
import {
  X, Check, Lock, Clock, MapPin, Briefcase, Award, Wrench,
  Target, Zap, ListChecks, ChevronRight, ExternalLink
} from 'lucide-react';

const STATUS_CONFIG = {
  COMPLETED: { labelKey: 'roadmap.panel.status.completed', color: 'var(--accent)', icon: Check, bg: 'var(--accent-subtle)', border: 'var(--accent-subtle-hover)' },
  IN_PROGRESS: { labelKey: 'roadmap.panel.status.inProgress', color: 'var(--cyan)', icon: Clock, bg: 'var(--cyan-subtle)', border: 'var(--cyan-subtle-hover)' },
  FUTURE: { labelKey: 'roadmap.panel.status.future', color: 'var(--text-muted)', icon: Lock, bg: 'var(--roadmap-locked-bg)', border: 'var(--roadmap-locked-border)' }
};

// Base XP per level (derived gamification display; completion is driven by backend status)
const BASE_XP = 100;

export default function LevelDetailPanel({ level, isCurrent, onClose, onContinue, onNavigate }) {
  const { t } = useI18n();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!level) return null;

  const config = STATUS_CONFIG[level.status] || STATUS_CONFIG.FUTURE;
  const StatusIcon = config.icon;
  const isAccessible = level.status !== 'FUTURE';
  const levelXp = BASE_XP * (level.levelNumber + 1);

  const missions = level.experiences || [];
  const certs = level.certifications || [];
  const tools = level.tools || [];
  const progress = level.progress ?? (level.status === 'COMPLETED' ? 100 : level.status === 'IN_PROGRESS' ? 0 : 0);

  return (
    <div className="level-panel-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('roadmap.panel.ariaLabel', { level: level.levelNumber })}>
      <div
        className="level-panel"
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="level-panel-close" onClick={onClose} aria-label={t('roadmap.panel.close')}>
          <X size={20} />
        </button>

        {/* Header */}
        <header className="level-panel-header" style={{ '--panel-accent': config.color, '--panel-border': config.border }}>
          <div className="level-panel-status" style={{ background: config.bg, borderColor: config.border }}>
            <StatusIcon size={16} style={{ color: config.color }} />
            <span style={{ color: config.color }}>{t(config.labelKey)}</span>
          </div>
          <div className="level-panel-level">
            <span className="level-panel-num">{t('roadmap.panel.levelLabel', { level: String(level.levelNumber).padStart(2, '0') })}</span>
            <h2 className="level-panel-title">{level.title}</h2>
          </div>
          {isCurrent && (
            <div className="level-panel-current-badge">
              <MapPin size={14} />
              {t('roadmap.panel.currentLevel')}
            </div>
          )}
        </header>

        {/* Objective */}
        <section className="level-panel-section">
          <h3 className="level-panel-section-title">
            <Target size={18} />
            {t('roadmap.panel.sections.objective.title')}
          </h3>
          <p className="level-panel-objective">{level.summary}</p>
        </section>

        {/* Progress */}
        <section className="level-panel-section">
          <div className="level-panel-progress-row">
            <div className="level-panel-progress-info">
              <h3 className="level-panel-section-title">
                <Zap size={18} />
                {t('roadmap.panel.sections.progress.title')}
              </h3>
              <span className="level-panel-xp">{t('roadmap.panel.sections.progress.xp', { xp: levelXp })}</span>
            </div>
            <div className="level-panel-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="level-panel-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        {/* Missions */}
        {(missions.length > 0 || isAccessible) && (
          <section className="level-panel-section">
            <h3 className="level-panel-section-title">
              <Briefcase size={18} />
              {t('roadmap.panel.sections.missions.title')}
              <span className="level-panel-count">{missions.length}</span>
            </h3>
            {missions.length > 0 ? (
              <ul className="level-panel-list">
                {missions.map((m, i) => (
                  <li key={m.id || i} className="level-panel-list-item">
                    <span className="level-panel-item-index">{i + 1}</span>
                    <span>{m.description}</span>
                  </li>
                ))}
              </ul>
            ) : isAccessible ? (
              <p className="level-panel-empty">{t('roadmap.panel.sections.missions.empty')}</p>
            ) : (
              <p className="level-panel-locked">{t('roadmap.panel.sections.missions.locked')}</p>
            )}
          </section>
        )}

        {/* Skills / Tools */}
        {(tools.length > 0 || isAccessible) && (
          <section className="level-panel-section">
            <h3 className="level-panel-section-title">
              <Wrench size={18} />
              {t('roadmap.panel.sections.tools.title')}
            </h3>
            {tools.length > 0 ? (
              <div className="level-panel-tags">
                {tools.map((t, i) => (
                  <span key={t.id || i} className="level-panel-tag">{t.name}</span>
                ))}
              </div>
            ) : isAccessible ? (
              <p className="level-panel-empty">{t('roadmap.panel.sections.tools.empty')}</p>
            ) : (
              <p className="level-panel-locked">{t('roadmap.panel.sections.tools.locked')}</p>
            )}
          </section>
        )}

        {/* Certifications */}
        {(certs.length > 0 || isAccessible) && (
          <section className="level-panel-section">
            <h3 className="level-panel-section-title">
              <Award size={18} />
              {t('roadmap.panel.sections.certifications.title')}
            </h3>
            {certs.length > 0 ? (
              <ul className="level-panel-certs">
                {certs.map((c, i) => (
                  <li key={c.id || i} className="level-panel-cert">
                    <Award size={18} className="level-panel-cert-icon" />
                    <div>
                      <p className="level-panel-cert-name">{c.name}</p>
                      <p className="level-panel-cert-org">{c.organization}</p>
                    </div>
                    {c.certificateUrl && (
                      <a href={c.certificateUrl} target="_blank" rel="noopener noreferrer" className="level-panel-cert-link">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : isAccessible ? (
              <p className="level-panel-empty">{t('roadmap.panel.sections.certifications.empty')}</p>
            ) : (
              <p className="level-panel-locked">{t('roadmap.panel.sections.certifications.locked')}</p>
            )}
          </section>
        )}

        {/* Validation conditions */}
        <section className="level-panel-section">
          <h3 className="level-panel-section-title">
            <ListChecks size={18} />
            {t('roadmap.panel.sections.conditions.title')}
          </h3>
          <ul className="level-panel-conditions">
            <li className={missions.length > 0 ? 'done' : ''}>
              <Check size={14} /> {t('roadmap.panel.sections.conditions.items.missions', { count: missions.length })}
            </li>
            <li>
              <Check size={14} /> {t('roadmap.panel.sections.conditions.items.progress')}
            </li>
            {certs.length > 0 && (
              <li className="done">
                <Check size={14} /> {t('roadmap.panel.sections.conditions.items.certs', { count: certs.length })}
              </li>
            )}
            <li>
              <Check size={14} /> {t('roadmap.panel.sections.conditions.items.prerequisites')}
            </li>
          </ul>
        </section>

        {/* Footer actions */}
        <footer className="level-panel-footer">
          {isCurrent ? (
            <button className="cyber-btn level-panel-continue" onClick={() => onContinue && onContinue(level)}>
              {t('roadmap.panel.footer.continue')}
              <ChevronRight size={16} />
            </button>
          ) : level.status === 'COMPLETED' ? (
            <div className="level-panel-completed">
              <Check size={18} />
              {t('roadmap.panel.footer.completed', { xp: levelXp })}
            </div>
          ) : (
            <div className="level-panel-locked-footer">
              <Lock size={16} />
              {t('roadmap.panel.footer.locked')}
            </div>
          )}
          <div className="level-panel-nav">
            <button
              className="cyber-btn sec"
              onClick={() => onNavigate && onNavigate(-1)}
              disabled={level.levelNumber <= 0}
            >
              {t('roadmap.panel.footer.prev')}
            </button>
            <button
              className="cyber-btn sec"
              onClick={() => onNavigate && onNavigate(1)}
              disabled={level.levelNumber >= 20}
            >
              {t('roadmap.panel.footer.next')}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}