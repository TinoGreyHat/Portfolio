import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { Loader2, XCircle, Globe, Edit, Save, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import {
    loadPageSettingsAdmin, savePageSettingsAdmin, deletePageSettingsAdmin
} from '../../services/apiService';

export default function PageSettingsManager({ pageKey = 'certifications', onSettingsChange }) {
    const { t } = useI18n();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await loadPageSettingsAdmin();
            const pageSettings = data.find(s => s.pageKey === pageKey) || null;
            setSettings(pageSettings);
        } catch (e) {
            console.error(e);
            setError(t('admin.pageSettings.loadError') || 'Error loading page settings');
        } finally {
            setLoading(false);
        }
    }, [pageKey, t]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!settings) return;

        setSaving(true);
        setError(null);
        try {
            const saved = await savePageSettingsAdmin(settings);
            setSettings(saved);
            if (onSettingsChange) onSettingsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.pageSettings.saveError') || 'Error saving page settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!settings?.id) return;
        if (!window.confirm(t('admin.pageSettings.confirmDelete') || 'Delete these page settings?')) return;

        try {
            await deletePageSettingsAdmin(settings.id);
            setSettings(null);
            if (onSettingsChange) onSettingsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.pageSettings.deleteError') || 'Error deleting page settings');
        }
    };

    const getTranslation = (frField, enField) => {
        const lang = t('common.lang') || 'fr';
        return lang === 'fr' ? (settings?.[frField] || '') : (settings?.[enField] || '');
    };

    const initialSettings = {
        pageKey,
        titleFr: '',
        titleEn: '',
        descriptionFr: '',
        descriptionEn: '',
        footerFr: '',
        footerEn: '',
        displayOrder: 0
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                {t('admin.pageSettings.loading') || 'Loading page settings...'}
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div style={{
                    padding: '12px 16px',
                    background: 'var(--red-subtle)',
                    border: '1px solid var(--red)',
                    borderRadius: 6,
                    color: 'var(--red)',
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>
                        <XCircle size={16} />
                    </button>
                </div>
            )}

            <div className="glass-panel" style={{ padding: 20 }}>
                <h3 style={{ color: 'var(--cyan)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe size={20} />
                    {t('admin.pageSettings.title', { page: pageKey })}
                </h3>

                {settings ? (
                    <>
                        <div style={{ marginBottom: 20 }}>
                            <h4 style={{ marginBottom: 12, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                {t('admin.pageSettings.titleField')}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {t('admin.pageSettings.titleFr')} (FR)
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.titleFr || ''}
                                        onChange={(e) => handleChange('titleFr', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: 'var(--bg-cyber)',
                                            border: '1px solid var(--border-card)',
                                            borderRadius: 4,
                                            color: 'var(--text-main)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder={t('admin.pageSettings.titlePlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {t('admin.pageSettings.titleEn')} (EN)
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.titleEn || ''}
                                        onChange={(e) => handleChange('titleEn', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: 'var(--bg-cyber)',
                                            border: '1px solid var(--border-card)',
                                            borderRadius: 4,
                                            color: 'var(--text-main)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder={t('admin.pageSettings.titlePlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <h4 style={{ marginBottom: 12, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                {t('admin.pageSettings.descriptionField')}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {t('admin.pageSettings.descriptionFr')} (FR)
                                    </label>
                                    <textarea
                                        value={settings.descriptionFr || ''}
                                        onChange={(e) => handleChange('descriptionFr', e.target.value)}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: 'var(--bg-cyber)',
                                            border: '1px solid var(--border-card)',
                                            borderRadius: 4,
                                            color: 'var(--text-main)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            resize: 'vertical',
                                            minHeight: 100
                                        }}
                                        placeholder={t('admin.pageSettings.descriptionPlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {t('admin.pageSettings.descriptionEn')} (EN)
                                    </label>
                                    <textarea
                                        value={settings.descriptionEn || ''}
                                        onChange={(e) => handleChange('descriptionEn', e.target.value)}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: 'var(--bg-cyber)',
                                            border: '1px solid var(--border-card)',
                                            borderRadius: 4,
                                            color: 'var(--text-main)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            resize: 'vertical',
                                            minHeight: 100
                                        }}
                                        placeholder={t('admin.pageSettings.descriptionPlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <h4 style={{ marginBottom: 12, color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                {t('admin.pageSettings.footerField')}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {t('admin.pageSettings.footerFr')} (FR)
                                    </label>
                                    <textarea
                                        value={settings.footerFr || ''}
                                        onChange={(e) => handleChange('footerFr', e.target.value)}
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: 'var(--bg-cyber)',
                                            border: '1px solid var(--border-card)',
                                            borderRadius: 4,
                                            color: 'var(--text-main)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            resize: 'vertical',
                                            minHeight: 80
                                        }}
                                        placeholder={t('admin.pageSettings.footerPlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {t('admin.pageSettings.footerEn')} (EN)
                                    </label>
                                    <textarea
                                        value={settings.footerEn || ''}
                                        onChange={(e) => handleChange('footerEn', e.target.value)}
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: 'var(--bg-cyber)',
                                            border: '1px solid var(--border-card)',
                                            borderRadius: 4,
                                            color: 'var(--text-main)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            resize: 'vertical',
                                            minHeight: 80
                                        }}
                                        placeholder={t('admin.pageSettings.footerPlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-card)' }}>
                            <button onClick={handleDelete} className="cyber-btn sec danger" disabled={saving}>
                                <Trash2 size={14} style={{ marginRight: 6 }} />
                                {t('common.delete')}
                            </button>
                            <button onClick={handleSave} className="cyber-btn" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 size={14} className="spin" style={{ marginRight: 8 }} />
                                        {t('common.saving')}
                                    </>
                                ) : (
                                    <>
                                        <Save size={14} style={{ marginRight: 6 }} />
                                        {t('common.save')}
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: 16, fontFamily: 'var(--font-mono)' }}>{t('admin.pageSettings.noSettings')}</p>
                        <button onClick={() => setSettings(initialSettings)} className="cyber-btn" disabled={saving}>
                            <Plus size={16} style={{ marginRight: 8 }} />
                            {t('admin.pageSettings.create')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}