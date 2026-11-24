import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { ArrowLeft, Target, Award, GraduationCap, Star } from 'lucide-react';
import { loadRoadmap } from '../services/roadmapService';
import RoadmapPath from './RoadmapPath';
import RoadmapNode from './RoadmapNode';
import LevelDetailPanel from './LevelDetailPanel';
import ZoneIsland from './ZoneIsland';

// --- Configuration ---
const STEP_HEIGHT = 210;       // vertical space per level
const TOP_PADDING = 160;       // space above the topmost level (LV.20)
const BOTTOM_PADDING = 180;    // space below LV.00 + side quests
const MAP_WIDTH = 1000;        // SVG viewBox width
const TOTAL_LEVELS = 21;

const SIDE_QUESTS = [
  { id: 'c1', icon: Star, titleKey: 'roadmap.sideQuests.certifications.items[0]', type: 'cert' },
  { id: 'c2', icon: Star, titleKey: 'roadmap.sideQuests.certifications.items[1]', type: 'cert' },
  { id: 'c3', icon: Star, titleKey: 'roadmap.sideQuests.certifications.items[2]', type: 'cert' },
  { id: 'c4', icon: Star, titleKey: 'roadmap.sideQuests.certifications.items[3]', type: 'cert' },
  { id: 'c5', icon: Star, titleKey: 'roadmap.sideQuests.certifications.items[4]', type: 'cert' },
];

const ACADEMIC_QUEST = [
  { id: 'a0', titleKey: 'roadmap.sideQuests.academic.items[0]' },
  { id: 'a1', titleKey: 'roadmap.sideQuests.academic.items[1]' },
  { id: 'a2', titleKey: 'roadmap.sideQuests.academic.items[2]' },
  { id: 'a3', titleKey: 'roadmap.sideQuests.academic.items[3]' },
];

// Compute a level's position on the map.
// Level 0 is at the bottom, level 20 at the top.
// X weaves left/right with a smooth sine wave for natural turns.
function getLevelPosition(levelNumber) {
  const y = (TOTAL_LEVELS - 1 - levelNumber) * STEP_HEIGHT + TOP_PADDING;
  const angle = levelNumber * 0.78;
  const xPercent = 50 + Math.sin(angle) * 33; // 17% .. 83%
  const side = Math.sin(angle) >= 0 ? 'right' : 'left';
  return { y, xPercent, side };
}

export default function RoadmapPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const mapRef = useRef(null);
  const checkpointRefs = useRef({});

  const fetchRoadmap = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loadRoadmap();
      const sorted = [...data].sort((a, b) => a.levelNumber - b.levelNumber);
      setRoadmap(sorted);

      // Current level = first IN_PROGRESS, else last COMPLETED, else 0
      const inProgress = sorted.find((l) => l.status === 'IN_PROGRESS');
      const completed = [...sorted].reverse().find((l) => l.status === 'COMPLETED');
      setCurrentLevel(inProgress?.levelNumber ?? completed?.levelNumber ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  // Lock body scroll so the map's internal scroll is the only scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Compute map height and zone bounds
  const mapHeight = useMemo(
    () => (TOTAL_LEVELS - 1) * STEP_HEIGHT + TOP_PADDING + BOTTOM_PADDING,
    []
  );

  // Route points for the SVG (matching checkpoint centers)
  const routePoints = useMemo(() => {
    return roadmap.map((level) => {
      const pos = getLevelPosition(level.levelNumber);
      return { x: (pos.xPercent / 100) * MAP_WIDTH, y: pos.y };
    });
  }, [roadmap]);

  // Scroll to current level once data is loaded
  useEffect(() => {
    if (loading || roadmap.length === 0) return;
    const t = setTimeout(() => {
      if (mapRef.current) {
        const pos = getLevelPosition(currentLevel);
        const mapRect = mapRef.current.getBoundingClientRect();
        // Center the checkpoint vertically in the viewport
        const targetScrollTop = pos.y - mapRect.height / 2;
        mapRef.current.scrollTop = Math.max(0, targetScrollTop);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [loading, roadmap, currentLevel]);

  const handleSelectLevel = (level) => setSelectedLevel(level);

  const handleNavigateInPanel = (dir) => {
    if (!selectedLevel) return;
    const nextNum = selectedLevel.levelNumber + dir;
    if (nextNum < 0 || nextNum >= TOTAL_LEVELS) return;
    const next = roadmap.find((l) => l.levelNumber === nextNum);
    if (next) setSelectedLevel(next);
  };

  const handleBack = () => navigate('/');

  if (loading) {
    return (
      <div className="roadmap-page loading">
        <div className="roadmap-loader" aria-busy="true">
          <div className="loader-ring" />
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-page error">
        <div className="glass-panel" style={{ maxWidth: 600, margin: '40px auto', padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--red)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>{t('common.error')}</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error}</p>
          <button className="cyber-btn" onClick={fetchRoadmap}>{t('common.retry')}</button>
        </div>
      </div>
    );
  }

  const completedCount = roadmap.filter((l) => l.status === 'COMPLETED').length;
  const progressPct = Math.round((completedCount / TOTAL_LEVELS) * 100);

  // Zone data from translations
  const zones = [
    {
      id: 3,
      theme: 'executive',
      accent: '#a855f7',
      ...t('roadmap.zones.zone3'),
      levels: [16, 17, 18, 19, 20],
    },
    {
      id: 2,
      theme: 'leadership',
      accent: '#00d2ff',
      ...t('roadmap.zones.zone2'),
      levels: [8, 9, 10, 11, 12, 13, 14, 15],
    },
    {
      id: 1,
      theme: 'technical',
      accent: '#00e89b',
      ...t('roadmap.zones.zone1'),
      levels: [0, 1, 2, 3, 4, 5, 6, 7],
    },
  ];

  return (
    <div className="roadmap-world">
      {/* ===== Sticky HUD ===== */}
      <header className="roadmap-hud">
        <button className="roadmap-back-btn" onClick={handleBack} aria-label={t('common.back')}>
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
        </button>

        <div className="roadmap-hud-center">
          <h1 className="roadmap-hud-title">
            <Target size={20} />
            {t('roadmap.hud.title')}
          </h1>
          <p className="roadmap-hud-sub">{t('roadmap.hud.subtitle')}</p>
        </div>

        <div className="roadmap-hud-stats">
          <div className="hud-stat">
            <span className="hud-stat-label">{t('roadmap.hud.stats.validated')}</span>
            <span className="hud-stat-value">{completedCount}/{TOTAL_LEVELS}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-stat-label">{t('roadmap.hud.stats.level')}</span>
            <span className="hud-stat-value">LV. {String(currentLevel).padStart(2, '0')}</span>
          </div>
        </div>
      </header>

      {/* ===== Progress bar ===== */}
      <div className="roadmap-progress-bar-wrap">
        <div className="roadmap-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="roadmap-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="roadmap-progress-label">{progressPct}% · {completedCount}/{TOTAL_LEVELS} {t('roadmap.progress')}</span>
      </div>

      {/* ===== Scrollable map ===== */}
      <div className="roadmap-map-scroll" ref={mapRef}>
        <div className="roadmap-map" style={{ height: mapHeight }}>
          {/* Zone backgrounds with floating islands */}
          {zones.map((zone) => {
            const minLv = Math.min(...zone.levels);
            const maxLv = Math.max(...zone.levels);
            const topY = getLevelPosition(maxLv).y - 80;
            const bottomY = getLevelPosition(minLv).y + 80;
            return (
              <div
                key={zone.id}
                className={`zone-block zone-${zone.theme}`}
                style={{ top: topY, height: bottomY - topY }}
              >
                <div className="zone-island-wrap">
                  <ZoneIsland zone={zone.theme} />
                </div>
                <div className="zone-label" style={{ borderColor: zone.accent, color: zone.accent }}>
                  <span className="zone-code">{zone.code}</span>
                  <span className="zone-name">{zone.name}</span>
                </div>
              </div>
            );
          })}

          {/* SVG route */}
          <RoadmapPath points={routePoints} mapWidth={MAP_WIDTH} mapHeight={mapHeight} />

          {/* Checkpoints */}
          {roadmap.map((level) => {
            const pos = getLevelPosition(level.levelNumber);
            const isCurrent = level.levelNumber === currentLevel;
            return (
              <div
                key={level.levelNumber}
                ref={(el) => { checkpointRefs.current[level.levelNumber] = el; }}
              >
                <RoadmapNode
                  level={level}
                  isCurrent={isCurrent}
                  onSelect={handleSelectLevel}
                  position={{ x: `${pos.xPercent}%`, y: pos.y, side: pos.side }}
                />
              </div>
            );
          })}

          {/* Side Quests & Academic Quest (at the bottom of the map) */}
          <div className="side-quests-section" style={{ top: mapHeight - BOTTOM_PADDING + 20 }}>
            <div className="side-quests-grid">
              <div className="side-quest-panel">
                <div className="side-quest-header">
                  <Star size={18} />
                  <h3>{t('roadmap.sideQuests.certifications.title')}</h3>
                </div>
                <p className="side-quest-desc">{t('roadmap.sideQuests.certifications.desc')}</p>
                <ul className="side-quest-list">
                  {SIDE_QUESTS.map((q, i) => (
                    <li key={q.id}>
                      <span className="side-quest-index">{String(i + 1).padStart(2, '0')}</span>
                      <q.icon size={14} />
                      <span>{t(q.titleKey)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="side-quest-panel academic">
                <div className="side-quest-header">
                  <GraduationCap size={18} />
                  <h3>{t('roadmap.sideQuests.academic.title')}</h3>
                </div>
                <p className="side-quest-desc">{t('roadmap.sideQuests.academic.desc')}</p>
                <ul className="side-quest-list">
                  {ACADEMIC_QUEST.map((q, _i) => (
                    <li key={q.id}>
                      <span className="side-quest-index">{q.id.toUpperCase()}</span>
                      <GraduationCap size={14} />
                      <span>{t(q.titleKey)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="side-quest-panel principle">
                <div className="side-quest-header">
                  <Award size={18} />
                  <h3>{t('roadmap.sideQuests.principle.title')}</h3>
                </div>
                <p className="principle-text" dangerouslySetInnerHTML={{ __html: t('roadmap.sideQuests.principle.text') }} />
                <p className="principle-tagline">{t('roadmap.sideQuests.principle.tagline')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Legend ===== */}
      <div className="roadmap-legend-map" aria-label={t('roadmap.legend')}>
        <div className="legend-item completed">
          <span className="legend-dot" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }} />
          <span>{t('roadmap.legendMap.completed')}</span>
        </div>
        <div className="legend-item in-progress">
          <span className="legend-dot" style={{ borderColor: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan-glow)' }} />
          <span>{t('roadmap.legendMap.inProgress')}</span>
        </div>
        <div className="legend-item future">
          <span className="legend-dot" style={{ borderColor: 'var(--border-card)' }} />
          <span>{t('roadmap.legendMap.future')}</span>
        </div>
      </div>

      {/* ===== Detail Panel ===== */}
      {selectedLevel && (
        <LevelDetailPanel
          level={selectedLevel}
          isCurrent={selectedLevel.levelNumber === currentLevel}
          onClose={() => setSelectedLevel(null)}
          onNavigate={handleNavigateInPanel}
        />
      )}
    </div>
  );
}