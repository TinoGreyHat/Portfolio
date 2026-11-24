import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
    Plus, Trash2, Edit, Copy, GripVertical,
    Loader2, ArrowUp, ArrowDown, Eye, EyeOff,
    FileText, List, Hash, Layers, Terminal,
    AlertTriangle, CheckCircle
} from 'lucide-react';
import {
    loadCertDetails, createCertDetail, updateCertDetail,
    deleteCertDetail, reorderCertDetails, duplicateCertDetail
} from '../../services/apiService';
import CertificationDetailEditor from './CertificationDetailEditor';

const CONTENT_TYPE_LABELS = {
    paragraph: 'Paragraph',
    bulletList: 'Bullet List',
    numberedList: 'Numbered List',
    techList: 'Tech List',
    mixed: 'Mixed'
};

const CONTENT_TYPE_ICONS = {
    paragraph: FileText,
    bulletList: List,
    numberedList: Hash,
    techList: Layers,
    mixed: Terminal
};

export default function CertificationDetailsManager({ certification, details: initialDetails, readOnly, onDetailsChange }) {
    const { t } = useI18n();
    const [details, setDetails] = useState(initialDetails || []);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(null);
    const [editingDetail, setEditingDetail] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (certification?.id && details.length === 0) {
            loadDetails();
        } else if (initialDetails) {
            setDetails(initialDetails);
        }
    }, [certification?.id, initialDetails]);

    const loadDetails = async () => {
        if (!certification?.id) return;
        setLoading(true);
        try {
            const data = await loadCertDetails(certification.id);
            setDetails(data || []);
        } catch (e) {
            console.error(e);
            setError(t('admin.certDetails.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDetail = async (detailData) => {
        const isUpdate = detailData.id;
        setSaving(detailData.id || 'create');
        try {
            let savedDetail;
            if (isUpdate) {
                savedDetail = await updateCertDetail(certification.id, detailData.id, detailData);
            } else {
                savedDetail = await createCertDetail(certification.id, detailData);
            }

            if (isUpdate) {
                setDetails(prev => prev.map(d => d.id === savedDetail.id ? savedDetail : d));
            } else {
                setDetails(prev => [...prev, savedDetail]);
            }

            if (onDetailsChange) onDetailsChange();
            setEditingDetail(null);
        } catch (e) {
            console.error(e);
            setError(t('admin.certDetails.saveError'));
        } finally {
            setSaving(null);
        }
    };

    const handleDeleteDetail = async (detailId) => {
        if (!window.confirm(t('admin.certDetails.confirmDelete'))) return;

        try {
            await deleteCertDetail(certification.id, detailId);
            setDetails(prev => prev.filter(d => d.id !== detailId));
            if (onDetailsChange) onDetailsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.certDetails.deleteError'));
        }
    };

    const handleDuplicateDetail = async (detailId) => {
        try {
            setSaving(`duplicate-${detailId}`);
            const duplicated = await duplicateCertDetail(certification.id, detailId);
            setDetails(prev => {
                const index = prev.findIndex(d => d.id === detailId);
                return [...prev.slice(0, index + 1), duplicated, ...prev.slice(index + 1)];
            });
            if (onDetailsChange) onDetailsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.certDetails.duplicateError'));
        } finally {
            setSaving(null);
        }
    };

    const handleReorder = async (detailIdsInOrder) => {
        try {
            await reorderCertDetails(certification.id, detailIdsInOrder);
            const detailMap = new Map(details.map(d => [d.id, d]));
            const reordered = detailIdsInOrder.map(id => detailMap.get(id)).filter(Boolean);
            setDetails(reordered);
        } catch (e) {
            console.error(e);
            setError(t('admin.certDetails.reorderError'));
            loadDetails();
        }
    };

    const moveDetail = (index, direction) => {
        const newDetails = [...details];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newDetails.length) return;
        [newDetails[index], newDetails[newIndex]] = [newDetails[newIndex], newDetails[index]];
        setDetails(newDetails);
        handleReorder(newDetails.map(d => d.id));
    };

    const ContentTypeIcon = ({ type }) => {
        const Icon = CONTENT_TYPE_ICONS[type] || FileText;
        return <Icon size={14} />;
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                {t('admin.certDetails.loading')}
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
                        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</span>
                    </button>
                </div>
            )}

            {/* Details List */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
                {details.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: 16, fontFamily: 'var(--font-mono)' }}>{t('admin.certDetails.noDetails')}</p>
                        {!readOnly && (
                            <button onClick={() => setEditingDetail({})} className="cyber-btn">
                                <Plus size={16} style={{ marginRight: 8 }} />
                                {t('admin.certDetails.addFirst')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: 800 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--card-bg)' }}>
                                    <th style={{ padding: '12px 16px', width: '50px' }}>{t('admin.certDetails.table.drag')}</th>
                                    <th style={{ padding: '12px 16px', width: '60px' }}>{t('admin.table.id')}</th>
                                    <th style={{ padding: '12px 16px', width: '50px' }}>{t('admin.certDetails.table.type')}</th>
                                    <th style={{ padding: '12px 16px' }}>{t('admin.certDetails.table.title')}</th>
                                    <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.certDetails.table.icon')}</th>
                                    <th style={{ padding: '12px 16px', width: '200px' }}>{t('admin.certDetails.table.content')}</th>
                                    <th style={{ padding: '12px 16px', width: '180px' }}>{t('admin.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((detail, index) => (
                                    <tr key={detail.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            {!readOnly && (
                                                <>
                                                    <button
                                                        onClick={() => moveDetail(index, -1)}
                                                        disabled={index === 0 || saving}
                                                        className="icon-btn"
                                                        aria-label={t('admin.certDetails.moveUp')}
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveDetail(index, 1)}
                                                        disabled={index === details.length - 1 || saving}
                                                        className="icon-btn"
                                                        aria-label={t('admin.certDetails.moveDown')}
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {detail.id}
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: 6,
                                                background: 'var(--accent-subtle)',
                                                color: 'var(--accent)'
                                            }}>
                                                <ContentTypeIcon type={detail.contentType} />
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', maxWidth: 200 }}>
                                            <strong style={{ display: 'block', marginBottom: 2 }}>{detail.title}</strong>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                                                {CONTENT_TYPE_LABELS[detail.contentType] || detail.contentType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            {detail.icon ? (
                                                <span style={{ fontSize: '1.5rem' }}>{detail.icon}</span>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t('admin.certDetails.noIcon')}</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{
                                                maxHeight: 60,
                                                overflow: 'hidden',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {detail.content && detail.content.substring(0, 100)}{detail.content && detail.content.length > 100 ? '...' : ''}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                {!readOnly && (
                                                    <>
                                                        <button
                                                            onClick={() => setEditingDetail(detail)}
                                                            className="cyber-btn sec icon-btn"
                                                            title={t('admin.certDetails.edit')}
                                                            disabled={saving}
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDuplicateDetail(detail.id)}
                                                            className="cyber-btn sec icon-btn"
                                                            title={t('admin.certDetails.duplicate')}
                                                            disabled={saving}
                                                        >
                                                            <Copy size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteDetail(detail.id)}
                                                            className="cyber-btn sec icon-btn danger"
                                                            title={t('admin.certDetails.delete')}
                                                            disabled={saving}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!readOnly && (
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <button onClick={() => setEditingDetail({})} className="cyber-btn" disabled={saving}>
                        <Plus size={16} style={{ marginRight: 8 }} />
                        {t('admin.certDetails.addDetail')}
                    </button>
                </div>
            )}

            {/* Detail Editor Modal */}
            {editingDetail !== null && (
                <CertificationDetailEditor
                    detail={editingDetail}
                    onSave={handleSaveDetail}
                    onCancel={() => setEditingDetail(null)}
                    isSaving={saving}
                    contentTypes={Object.keys(CONTENT_TYPE_LABELS)}
                />
            )}
        </div>
    );
}