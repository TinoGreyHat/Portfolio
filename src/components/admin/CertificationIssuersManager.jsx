import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
    Plus, Trash2, Edit, Loader2,
    AlertTriangle, Globe, Image, XCircle
} from 'lucide-react';
import {
    loadIssuers, saveIssuer, deleteIssuer
} from '../../services/apiService';
import CertificationIssuerEditor from './CertificationIssuerEditor';

export default function CertificationIssuersManager({ issuers: initialIssuers, onIssuersChange, onClose }) {
    const { t } = useI18n();
    const [issuers, setIssuers] = useState(initialIssuers || []);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(null);
    const [editingIssuer, setEditingIssuer] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (issuers.length === 0) {
            loadIssuersData();
        } else if (initialIssuers) {
            setIssuers(initialIssuers);
        }
    }, [initialIssuers]);

    const loadIssuersData = async () => {
        setLoading(true);
        try {
            const data = await loadIssuers();
            setIssuers(data || []);
        } catch (e) {
            console.error(e);
            setError(t('admin.issuers.loadError') || 'Error loading issuers');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveIssuer = async (issuerData) => {
        const isUpdate = issuerData.id;
        setSaving(issuerData.id || 'create');
        try {
            const savedIssuer = await saveIssuer(issuerData);

            if (isUpdate) {
                setIssuers(prev => prev.map(i => i.id === savedIssuer.id ? savedIssuer : i));
            } else {
                setIssuers(prev => [...prev, savedIssuer]);
            }

            if (onIssuersChange) onIssuersChange();
            setEditingIssuer(null);
        } catch (e) {
            console.error(e);
            setError(t('admin.issuers.saveError') || 'Error saving issuer');
        } finally {
            setSaving(null);
        }
    };

    const handleDeleteIssuer = async (issuerId) => {
        if (!window.confirm(t('admin.issuers.confirmDelete') || 'Delete this issuer?')) return;

        try {
            await deleteIssuer(issuerId);
            setIssuers(prev => prev.filter(i => i.id !== issuerId));
            if (onIssuersChange) onIssuersChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.issuers.deleteError') || 'Error deleting issuer');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                {t('admin.issuers.loading') || 'Loading issuers...'}
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

            {/* Issuers List */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
                {issuers.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Globe size={32} style={{ marginBottom: 16, color: 'var(--accent)', opacity: 0.5 }} />
                        <p style={{ marginBottom: 16, fontFamily: 'var(--font-mono)' }}>{t('admin.issuers.noIssuers')}</p>
                        <button onClick={() => setEditingIssuer({})} className="cyber-btn" disabled={saving}>
                            <Plus size={16} style={{ marginRight: 8 }} />
                            {t('admin.issuers.add')}
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: 700 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--card-bg)' }}>
                                    <th style={{ padding: '12px 16px', width: '60px' }}>{t('admin.table.id')}</th>
                                    <th style={{ padding: '12px 16px' }}>{t('admin.issuers.table.name')}</th>
                                    <th style={{ padding: '12px 16px', width: '200px' }}>{t('admin.issuers.table.logo')}</th>
                                    <th style={{ padding: '12px 16px', width: '250px' }}>{t('admin.issuers.table.website')}</th>
                                    <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issuers.map((issuer) => (
                                    <tr key={issuer.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {issuer.id}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <strong>{issuer.name}</strong>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {issuer.logo ? (
                                                <img src={issuer.logo} alt={issuer.name} style={{ height: '32px', borderRadius: '4px', border: '1px solid var(--border-card)' }} />
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t('admin.issuers.noLogo')}</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {issuer.website ? (
                                                <a href={issuer.website} target="_blank" rel="noreferrer" className="cert-verify-link" style={{ fontSize: '0.85rem' }}>
                                                    {issuer.website}
                                                    <Globe size={12} />
                                                </a>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t('admin.issuers.noWebsite')}</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => setEditingIssuer(issuer)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.issuers.edit')}
                                                    disabled={saving}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteIssuer(issuer.id)}
                                                    className="cyber-btn sec icon-btn danger"
                                                    title={t('admin.issuers.delete')}
                                                    disabled={saving}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
                <button onClick={() => setEditingIssuer({})} className="cyber-btn" disabled={saving}>
                    <Plus size={16} style={{ marginRight: 8 }} />
                    {t('admin.issuers.add')}
                </button>
            </div>

            {/* Issuer Editor Modal */}
            {editingIssuer !== null && (
                <CertificationIssuerEditor
                    issuer={editingIssuer}
                    onSave={handleSaveIssuer}
                    onCancel={() => setEditingIssuer(null)}
                    isSaving={saving}
                />
            )}
        </div>
    );
}