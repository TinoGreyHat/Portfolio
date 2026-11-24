import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, FolderGit2, Award, Plus, Trash2, MapPin, Loader2, Lock, LockOpen, ArrowLeft, Globe, Settings } from 'lucide-react';
import { logoutAdmin, loadProjects, loadCerts, deleteCert, saveCert, loadIssuers } from '../../services/apiService';
import {
    loadRoadmap,
    updateRoadmapLevel
} from '../../services/roadmapService';
import AdminProjectsManager from './AdminProjectsManager';
import AdminCertificationsManager from './AdminCertificationsManager';
import PageSettingsManager from './PageSettingsManager';

export default function AdminDashboard({ onLogout }) {
  const { t, lang, setLang, availableLangs } = useI18n();
  const { resolvedMode, setMode, availableModes } = useTheme();
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [roadmapLevels, setRoadmapLevels] = useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [savingLevel, setSavingLevel] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pData, cData] = await Promise.all([loadProjects(), loadCerts()]);
      setProjects(pData);
      setCerts(cData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCertsRefresh = useCallback(() => {
    // This will be called by AdminCertificationsManager after changes
    // We don't need to do anything here as it manages its own state
  }, []);

  const fetchRoadmap = useCallback(async () => {
    setLoadingRoadmap(true);
    try {
      const data = await loadRoadmap();
      const sorted = [...data].sort((a, b) => a.levelNumber - b.levelNumber);
      setRoadmapLevels(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRoadmap(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'roadmap') {
      fetchRoadmap();
    }
  }, [activeTab, fetchRoadmap]);

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  const handleProjectsRefresh = useCallback(() => {
    // This will be called by AdminProjectsManager after changes
    // We don't need to do anything here as it manages its own state
  }, []);

  const getLevelTitle = (levelNumber) => {
    // Use the level's title from the data if available, otherwise generate a default
    const level = roadmapLevels.find(l => l.levelNumber === levelNumber);
    if (level && level.title) return level.title;
    return `Niveau ${levelNumber}`;
  };

  const getStatusLabel = (status) => {
    return t(`admin.roadmap.statusLabels.${status.toLowerCase()}`) || status;
  };

  const handleToggleLock = async (levelNumber, currentStatus) => {
    const newStatus = currentStatus === 'FUTURE' ? 'IN_PROGRESS' : 'FUTURE';
    const confirmMsg = currentStatus === 'FUTURE' ? t('admin.roadmap.confirmUnlock') : t('admin.roadmap.confirmLock');

    if (!window.confirm(confirmMsg)) return;

    setSavingLevel(levelNumber);
    try {
      await updateRoadmapLevel(levelNumber, { status: newStatus });
      setRoadmapLevels(prev => prev.map(l =>
        l.levelNumber === levelNumber ? { ...l, status: newStatus } : l
      ));
      // Show success feedback
      console.log(t('admin.roadmap.saveSuccess'));
    } catch (e) {
      console.error(e);
      alert(t('admin.roadmap.saveError'));
    } finally {
      setSavingLevel(null);
    }
  };

  const handleUnlockAll = async () => {
    if (!window.confirm(t('admin.roadmap.bulkActions.confirmUnlockAll'))) return;

    setSavingLevel('all');
    try {
      for (const level of roadmapLevels) {
        if (level.status === 'FUTURE') {
          await updateRoadmapLevel(level.levelNumber, { status: 'IN_PROGRESS' });
        }
      }
      setRoadmapLevels(prev => prev.map(l =>
        l.status === 'FUTURE' ? { ...l, status: 'IN_PROGRESS' } : l
      ));
      console.log(t('admin.roadmap.saveSuccess'));
    } catch (e) {
      console.error(e);
      alert(t('admin.roadmap.saveError'));
    } finally {
      setSavingLevel(null);
    }
  };

  const handleLockAll = async () => {
    if (!window.confirm(t('admin.roadmap.bulkActions.confirmLockAll'))) return;

    setSavingLevel('all');
    try {
      for (const level of roadmapLevels) {
        if (level.status !== 'FUTURE') {
          await updateRoadmapLevel(level.levelNumber, { status: 'FUTURE' });
        }
      }
      setRoadmapLevels(prev => prev.map(l =>
        l.status !== 'FUTURE' ? { ...l, status: 'FUTURE' } : l
      ));
      console.log(t('admin.roadmap.saveSuccess'));
    } catch (e) {
      console.error(e);
      alert(t('admin.roadmap.saveError'));
    } finally {
      setSavingLevel(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'status-completed';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'FUTURE': return 'status-future';
      default: return '';
    }
  };

  return (
    <div className="glass-panel" style={{ minHeight: '100vh', background: 'var(--bg-cyber)', color: 'var(--text-main)', padding: 40 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottom: '1px solid var(--border-card)', paddingBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <button className="page-back-btn" onClick={handleBack} aria-label={t('common.back')}>
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
        </button>
        <h1 style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>[TINOGREYHAT_SYSADMIN]</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--card-bg)', border: '1px solid var(--border-card)', borderRadius: 6 }}>
            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                outline: 'none'
              }}
              aria-label={t('admin.lang.label')}
            >
              {availableLangs.map(l => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
          {/* Theme/Brightness Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--card-bg)', border: '1px solid var(--border-card)', borderRadius: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('admin.theme.label')}</span>
            <select
              value={resolvedMode}
              onChange={(e) => setMode(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                outline: 'none'
              }}
              aria-label={t('admin.theme.label')}
            >
              {availableModes.map(m => (
                <option key={m} value={m}>
                  {m === 'dark' ? t('admin.theme.dark') : m === 'light' ? t('admin.theme.light') : t('admin.theme.system')}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleLogout} className="cyber-btn sec">
            <LogOut size={16} style={{ marginRight: 8 }} />
            {t('admin.logout')}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
        <button className={"cyber-btn " + (activeTab === 'projects' ? '' : 'sec')} onClick={() => setActiveTab('projects')}>
          <FolderGit2 size={16} style={{ marginRight: 8 }} />
          {t('admin.tabs.projects')}
        </button>
        <button className={"cyber-btn " + (activeTab === 'certs' ? '' : 'sec')} onClick={() => setActiveTab('certs')}>
          <Award size={16} style={{ marginRight: 8 }} />
          {t('admin.tabs.certifications')}
        </button>
        <button className={"cyber-btn " + (activeTab === 'roadmap' ? '' : 'sec')} onClick={() => setActiveTab('roadmap')}>
          <MapPin size={16} style={{ marginRight: 8 }} />
          {t('admin.tabs.roadmap')}
        </button>
        <button className={"cyber-btn " + (activeTab === 'pageSettings' ? '' : 'sec')} onClick={() => setActiveTab('pageSettings')}>
          <Settings size={16} style={{ marginRight: 8 }} />
          {t('admin.tabs.pageSettings')}
        </button>
      </div>

      <div>
        {activeTab === 'projects' && (
          <AdminProjectsManager onRefresh={handleProjectsRefresh} />
        )}

        {activeTab === 'certs' && (
          <AdminCertificationsManager
            certifications={certs}
            onCertificationsChange={handleCertsRefresh}
          />
        )}

        {activeTab === 'roadmap' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
              <h2>{t('admin.roadmap.title')}</h2>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleUnlockAll} className="cyber-btn" disabled={savingLevel === 'all' || loadingRoadmap}>
                  <LockOpen size={16} style={{ marginRight: 8 }} />
                  {t('admin.roadmap.bulkActions.unlockAll')}
                </button>
                <button onClick={handleLockAll} className="cyber-btn sec" disabled={savingLevel === 'all' || loadingRoadmap}>
                  <Lock size={16} style={{ marginRight: 8 }} />
                  {t('admin.roadmap.bulkActions.lockAll')}
                </button>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: 20 }}>
              {loadingRoadmap ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                  {t('admin.roadmap.loading')}
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                        <th style={{ padding: 10, width: '80px' }}>{t('admin.roadmap.table.level')}</th>
                        <th style={{ padding: 10 }}>{t('admin.roadmap.table.title')}</th>
                        <th style={{ padding: 10, width: '140px' }}>{t('admin.roadmap.table.status')}</th>
                        <th style={{ padding: 10, width: '140px' }}>{t('admin.roadmap.table.locked')}</th>
                        <th style={{ padding: 10, width: '140px' }}>{t('admin.roadmap.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roadmapLevels.map(level => (
                        <tr key={level.levelNumber} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: 10, fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                            LV. {String(level.levelNumber).padStart(2, '0')}
                          </td>
                          <td style={{ padding: 10 }}>{level.title || getLevelTitle(level.levelNumber)}</td>
                          <td style={{ padding: 10 }}>
                            <span className={`status-badge ${getStatusBadgeClass(level.status)}`}>
                              {getStatusLabel(level.status)}
                            </span>
                          </td>
                          <td style={{ padding: 10, textAlign: 'center' }}>
                            <span style={{
                              color: level.status === 'FUTURE' ? 'var(--red)' : 'var(--accent)',
                              fontWeight: 'bold',
                              fontFamily: 'var(--font-mono)'
                            }}>
                              {level.status === 'FUTURE' ? t('admin.roadmap.table.locked') : t('admin.roadmap.table.unlocked')}
                            </span>
                          </td>
                          <td style={{ padding: 10 }}>
                            <button
                              onClick={() => handleToggleLock(level.levelNumber, level.status)}
                              disabled={savingLevel === level.levelNumber}
                              className="cyber-btn"
                              style={{
                                padding: '6px 12px',
                                fontSize: '0.75rem',
                                background: level.status === 'FUTURE' ? 'var(--accent-subtle)' : 'var(--red-subtle)',
                                borderColor: level.status === 'FUTURE' ? 'var(--accent)' : 'var(--red)',
                                color: level.status === 'FUTURE' ? 'var(--accent)' : 'var(--red)'
                              }}
                            >
                              {savingLevel === level.levelNumber ? (
                                <Loader2 size={14} className="spin" />
                              ) : level.status === 'FUTURE' ? (
                                <>
                                  <LockOpen size={14} style={{ marginRight: 6 }} />
                                  {t('admin.roadmap.table.unlocked')}
                                </>
                              ) : (
                                <>
                                  <Lock size={14} style={{ marginRight: 6 }} />
                                  {t('admin.roadmap.table.locked')}
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pageSettings' && (
          <PageSettingsManager pageKey="certifications" />
        )}
      </div>
    </div>
  );
}