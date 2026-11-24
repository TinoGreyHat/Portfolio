import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Award, Briefcase, Wrench, Calendar, Clock, Lock, Check, ExternalLink, GraduationCap, Monitor, Shield, Search, Users, Building2, Crown } from 'lucide-react';
import { loadRoadmapLevel, loadRoadmap } from '../services/roadmapService';

export default function RoadmapDetailPage() {
    const { t, lang } = useI18n();
    const { level } = useParams();
    const navigate = useNavigate();
    const levelNumber = parseInt(level?.replace('niveau-', ''), 10);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roadmapContext, setRoadmapContext] = useState({ prev: null, next: null, total: 21 });

    const STATUS_CONFIG = {
        COMPLETED: { labelKey: 'roadmap.detail.status.completed', color: 'var(--accent)', icon: Check, bg: 'var(--roadmap-detail-status-completed-bg)', border: 'var(--roadmap-detail-status-completed-border)' },
        IN_PROGRESS: { labelKey: 'roadmap.detail.status.inProgress', color: 'var(--cyan)', icon: Clock, bg: 'var(--roadmap-detail-status-progress-bg)', border: 'var(--roadmap-detail-status-progress-border)' },
        FUTURE: { labelKey: 'roadmap.detail.status.future', color: 'var(--text-muted)', icon: Lock, bg: 'var(--roadmap-detail-status-future-bg)', border: 'var(--roadmap-detail-status-future-border)' }
    };

    const LEVEL_ICONS = {
        0: GraduationCap,
        1: Monitor,
        2: Shield,
        3: Search,
        4: Users,
        5: Building2,
        6: Crown
    };

    const fetchData = useCallback(async () => {
        if (isNaN(levelNumber) || levelNumber < 0 || levelNumber > 20) {
            setError(t('roadmap.detail.error.invalidLevel'));
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const levelData = await loadRoadmapLevel(levelNumber);
            if (!levelData) {
                // Level exists but not accessible (FUTURE)
                setError('locked');
                setLoading(false);
                return;
            }
            setData(levelData);

            // Fetch full roadmap for navigation context
            const fullRoadmap = await loadRoadmap();
            const currentIdx = fullRoadmap.findIndex(l => l.levelNumber === levelNumber);
            setRoadmapContext({
                prev: currentIdx > 0 ? fullRoadmap[currentIdx - 1].levelNumber : null,
                next: currentIdx < fullRoadmap.length - 1 ? fullRoadmap[currentIdx + 1].levelNumber : null,
                total: fullRoadmap.length
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [levelNumber, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBack = () => {
        navigate('/roadmap');
    };

    const handlePrev = () => {
        if (roadmapContext.prev !== null) {
            navigate(`/roadmap/niveau-${roadmapContext.prev}`);
        }
    };

    const handleNext = () => {
        if (roadmapContext.next !== null && data?.status !== 'FUTURE') {
            navigate(`/roadmap/niveau-${roadmapContext.next}`);
        }
    };

    if (loading) {
        return (
            <div className="roadmap-detail-page loading">
                <div className="roadmap-loader" aria-busy="true">
                    <div className="loader-ring" />
                    <p>{t('roadmap.detail.loading')}</p>
                </div>
            </div>
        );
    }

    if (error === 'locked') {
        return (
            <div className="roadmap-detail-page locked">
                <div className="glass-panel" style={{ maxWidth: '700px', margin: '60px auto', padding: '60px 40px', textAlign: 'center' }}>
                    <Lock size={64} style={{ color: 'var(--text-muted)', marginBottom: '24px' }} />
                    <h2 style={{ marginBottom: '16px' }}>{t('roadmap.detail.locked.title')}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                        {t('roadmap.detail.locked.message')}
                    </p>
                    <button className="cyber-btn" onClick={handleBack}>
                        <ArrowLeft size={16} style={{ marginRight: 8 }} />
                        {t('roadmap.detail.locked.backToRoadmap')}
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="roadmap-detail-page error">
                <div className="glass-panel" style={{ maxWidth: '600px', margin: '60px auto', padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--red)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>{t('roadmap.detail.error.loading')}</p>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
                    <button className="cyber-btn" onClick={fetchData}>{t('common.retry')}</button>
                    <button className="cyber-btn sec" style={{ marginLeft: '16px' }} onClick={handleBack}>{t('common.back')}</button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const config = STATUS_CONFIG[data.status] || STATUS_CONFIG.FUTURE;
    const StatusIcon = config.icon;
    const isAccessible = data.status !== 'FUTURE';

    // Determine hero badge
    const heroBadge = data.levelNumber === 0 ? t('roadmap.detail.hero.start') : data.levelNumber === 20 ? t('roadmap.detail.hero.goal') : t('roadmap.detail.hero.level', { level: data.levelNumber });

    // Locale for date formatting
    const locale = lang === 'fr' ? 'fr-FR' : 'en-US';

    return (
        <div className="roadmap-detail-page">
            {/* Navigation Header */}
            <header className="roadmap-detail-header">
                <button className="roadmap-back-btn" onClick={handleBack} aria-label={t('roadmap.detail.backAria')}>
                    <ArrowLeft size={20} />
                    <span>{t('roadmap.detail.backToRoadmap')}</span>
                </button>
                <div className="detail-level-indicator">
                    <span className="detail-level-number">{t('roadmap.detail.levelLabel', { level: data.levelNumber })}</span>
                    <span className={`detail-status ${data.status.toLowerCase()}`}>
                        <StatusIcon size={14} />
                        {t(config.labelKey)}
                    </span>
                </div>
                <div className="detail-nav" style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className={`cyber-btn sec ${roadmapContext.prev === null ? 'disabled' : ''}`}
                        onClick={handlePrev}
                        disabled={roadmapContext.prev === null}
                        aria-label={t('roadmap.detail.prevAria')}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        className={`cyber-btn sec ${roadmapContext.next === null || !isAccessible ? 'disabled' : ''}`}
                        onClick={handleNext}
                        disabled={roadmapContext.next === null || !isAccessible}
                        aria-label={t('roadmap.detail.nextAria')}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </header>

            <main className="roadmap-detail-main">
                <div className="section-container">
                    {/* Hero Section */}
                    <section className="detail-hero glass-panel" style={{ marginBottom: '40px' }}>
                        <div className="hero-header">
                            <div className="hero-level-badge">
                                {heroBadge}
                            </div>
                            <div className="hero-icon-wrapper">
                                {(() => {
                                    const LevelIcon = LEVEL_ICONS[data.levelNumber] || Monitor;
                                    return <LevelIcon size={48} style={{ color: config.color }} />;
                                })()}
                            </div>
                            <h1 className="hero-title">{data.title}</h1>
                            <div className="hero-status">
                                <StatusIcon size={18} style={{ color: config.color }} />
                                <span style={{ color: config.color }}>{t(config.labelKey)}</span>
                            </div>
                        </div>

                        <div className="hero-meta">
                            {data.startDate && (
                                <div className="meta-item">
                                    <Calendar size={16} />
                                    <span>{t('roadmap.detail.meta.startDate', { date: new Date(data.startDate).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) })}</span>
                                </div>
                            )}
                            {data.endDate && (
                                <div className="meta-item">
                                    <Calendar size={16} />
                                    <span>{t('roadmap.detail.meta.endDate', { date: new Date(data.endDate).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) })}</span>
                                </div>
                            )}
                            {(!data.startDate || !data.endDate) && data.status === 'FUTURE' && (
                                <div className="meta-item future">
                                    <Clock size={16} />
                                    <span>{t('roadmap.detail.meta.datesUndefined')}</span>
                                </div>
                            )}
                        </div>

                        <div className="hero-summary">
                            <p>{data.summary}</p>
                        </div>
                    </section>

                    {/* Experiences Section */}
                    {(data.experiences?.length > 0 || isAccessible) && (
                        <section className="detail-section glass-panel" style={{ marginBottom: '40px' }}>
                            <div className="section-header">
                                <h2 className="section-title-detail">
                                    <Briefcase size={22} className="title-icon" />
                                    {t('roadmap.detail.sections.experiences.title')}
                                </h2>
                                {isAccessible && (
                                    <p className="section-desc">{t('roadmap.detail.sections.experiences.desc')}</p>
                                )}
                            </div>

                            {data.experiences?.length > 0 ? (
                                <div className="experiences-list">
                                    {data.experiences.map((exp, idx) => (
                                        <article key={exp.id || idx} className="experience-card">
                                            <div className="exp-number">{idx + 1}</div>
                                            <div className="exp-content">
                                                <p className="exp-description">{exp.description}</p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : isAccessible ? (
                                <div className="empty-state">
                                    <Briefcase size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                    <p>{t('roadmap.detail.sections.experiences.empty')}</p>
                                </div>
                            ) : (
                                <div className="locked-preview">
                                    <Lock size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                    <p>{t('roadmap.detail.sections.experiences.locked')}</p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Certifications Section */}
                    {(data.certifications?.length > 0 || isAccessible) && (
                        <section className="detail-section glass-panel" style={{ marginBottom: '40px' }}>
                            <div className="section-header">
                                <h2 className="section-title-detail">
                                    <Award size={22} className="title-icon" />
                                    {t('roadmap.detail.sections.certifications.title')}
                                </h2>
                                {isAccessible && (
                                    <p className="section-desc">{t('roadmap.detail.sections.certifications.desc')}</p>
                                )}
                            </div>

                            {data.certifications?.length > 0 ? (
                                <div className="certifications-grid">
                                    {data.certifications.map((cert, idx) => (
                                        <article key={cert.id || idx} className="cert-detail-card">
                                            <div className="cert-icon">
                                                <Award size={24} />
                                            </div>
                                            <div className="cert-info">
                                                <h3 className="cert-name">{cert.name}</h3>
                                                <p className="cert-org">{cert.organization}</p>
                                                {cert.obtainedDate && (
                                                    <p className="cert-date">
                                                        <Calendar size={14} />
                                                        {t('roadmap.detail.sections.certifications.obtained', { date: new Date(cert.obtainedDate).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) })}
                                                    </p>
                                                )}
                                                {cert.certificateUrl && (
                                                    <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="cert-link">
                                                        <ExternalLink size={14} />
                                                        {t('roadmap.detail.sections.certifications.viewCert')}
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : isAccessible ? (
                                <div className="empty-state">
                                    <Award size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                    <p>{t('roadmap.detail.sections.certifications.empty')}</p>
                                </div>
                            ) : (
                                <div className="locked-preview">
                                    <Lock size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                    <p>{t('roadmap.detail.sections.certifications.locked')}</p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Tools Section */}
                    {(data.tools?.length > 0 || isAccessible) && (
                        <section className="detail-section glass-panel" style={{ marginBottom: '40px' }}>
                            <div className="section-header">
                                <h2 className="section-title-detail">
                                    <Wrench size={22} className="title-icon" />
                                    {t('roadmap.detail.sections.tools.title')}
                                </h2>
                                {isAccessible && (
                                    <p className="section-desc">{t('roadmap.detail.sections.tools.desc')}</p>
                                )}
                            </div>

                            {data.tools?.length > 0 ? (
                                <div className="tools-cloud">
                                    {data.tools.map((tool, idx) => (
                                        <span key={tool.id || idx} className="tool-badge">
                                            {tool.name}
                                        </span>
                                    ))}
                                </div>
                            ) : isAccessible ? (
                                <div className="empty-state">
                                    <Wrench size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                    <p>{t('roadmap.detail.sections.tools.empty')}</p>
                                </div>
                            ) : (
                                <div className="locked-preview">
                                    <Lock size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                    <p>{t('roadmap.detail.sections.tools.locked')}</p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Navigation Footer */}
                    <nav className="detail-footer-nav" aria-label={t('roadmap.detail.navAria')}>
                        <button
                            className={`cyber-btn sec ${roadmapContext.prev === null ? 'disabled' : ''}`}
                            onClick={handlePrev}
                            disabled={roadmapContext.prev === null}
                        >
                            <ChevronLeft size={16} style={{ marginRight: 8 }} />
                            {t('roadmap.detail.nav.prev')}
                        </button>
                        <button className="cyber-btn" onClick={handleBack}>
                            <ArrowLeft size={16} style={{ marginRight: 8 }} />
                            {t('roadmap.detail.nav.fullRoadmap')}
                        </button>
                        <button
                            className={`cyber-btn ${roadmapContext.next === null || !isAccessible ? 'sec disabled' : ''}`}
                            onClick={handleNext}
                            disabled={roadmapContext.next === null || !isAccessible}
                        >
                            {t('roadmap.detail.nav.next')}
                            <ChevronRight size={16} style={{ marginLeft: 8 }} />
                        </button>
                    </nav>
                </div>
            </main>
        </div>
    );
}