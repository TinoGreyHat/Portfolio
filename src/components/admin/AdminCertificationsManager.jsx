import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
    Plus, Trash2, Edit, Eye, EyeOff,
    ArrowUp, ArrowDown, GripVertical,
    Loader2, AlertTriangle, CheckCircle, XCircle,
    FileText, List, Hash, Layers, Terminal,
    Upload, Download, ExternalLink, Lock, Unlock
} from 'lucide-react';
import {
    loadCertsAdmin, saveCertAdmin, deleteCertAdmin,
    reorderCertsAdmin, updateCertPublicationStatus, updateCertVisibility,
    loadIssuers, saveIssuer, deleteIssuer,
    loadCertSkills, saveCertSkill, deleteCertSkill, reorderCertSkills,
    loadCertDetails, saveCertDetail, deleteCertDetail, reorderCertDetails, duplicateCertDetail,
    loadCertDocuments, uploadCertDocument, deleteCertDocument
} from '../../services/apiService';
import CertificationForm from './CertificationForm';
import CertificationDetailsManager from './CertificationDetailsManager';
import CertificationSkillsManager from './CertificationSkillsManager';
import CertificationDocumentsManager from './CertificationDocumentsManager';
import CertificationIssuersManager from './CertificationIssuersManager';

const PUBLICATION_STATUS_LABELS = {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    UNPUBLISHED: 'Unpublished'
};

const PUBLICATION_STATUS_COLORS = {
    DRAFT: 'var(--yellow)',
    PUBLISHED: 'var(--accent)',
    UNPUBLISHED: 'var(--red)'
};

const STATUS_LABELS = {
    VERIFIED: 'Verified',
    IN_PROGRESS: 'In Progress',
    PENDING: 'Pending'
};

const STATUS_COLORS = {
    VERIFIED: 'var(--accent)',
    IN_PROGRESS: 'var(--yellow)',
    PENDING: 'var(--cyan)'
};

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

export default function AdminCertificationsManager({ onRefresh }) {
    const { t } = useI18n();
    const [certs, setCerts] = useState([]);
    const [issuers, setIssuers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', publicationStatus: '', isVisible: '' });
    const [editingCert, setEditingCert] = useState(null);
    const [viewingCert, setViewingCert] = useState(null);
    const [managingDetailsFor, setManagingDetailsFor] = useState(null);
    const [managingSkillsFor, setManagingSkillsFor] = useState(null);
    const [managingDocumentsFor, setManagingDocumentsFor] = useState(null);
    const [managingIssuers, setManagingIssuers] = useState(false);
    const [saving, setSaving] = useState(null);
    const [reordering, setReordering] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [cData, iData] = await Promise.all([
                loadCertsAdmin(filters),
                loadIssuers()
            ]);
            setCerts(cData || []);
            setIssuers(iData || []);
        } catch (e) {
            console.error(e);
            setError(t('admin.certifications.loadError'));
        } finally {
            setLoading(false);
        }
    }, [filters, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveCert = async (certData) => {
        setSaving(certData.id ? `edit-${certData.id}` : 'create');
        try {
            await saveCertAdmin(certData);
            fetchData();
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error(e);
            setError(t('admin.certifications.saveError'));
        } finally {
            setSaving(null);
            setEditingCert(null);
        }
    };

    const handleDeleteCert = async (id) => {
        if (!window.confirm(t('admin.certifications.confirmDelete'))) return;
        try {
            await deleteCertAdmin(id);
            fetchData();
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error(e);
            setError(t('admin.certifications.deleteError'));
        }
    };

    const handleTogglePublication = async (cert, newStatus) => {
        const confirmMsg = t(`admin.certifications.confirm${newStatus}`);
        if (!window.confirm(confirmMsg)) return;

        try {
            await updateCertPublicationStatus(cert.id, newStatus);
            fetchData();
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error(e);
            setError(t('admin.certifications.publicationError'));
        }
    };

    const handleToggleVisibility = async (cert, newVisibility) => {
        const confirmMsg = newVisibility ? t('admin.certifications.confirmShow') : t('admin.certifications.confirmHide');
        if (!window.confirm(confirmMsg)) return;

        try {
            await updateCertVisibility(cert.id, newVisibility);
            fetchData();
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error(e);
            setError(t('admin.certifications.visibilityError'));
        }
    };

    const handleReorder = async (certIdsInOrder) => {
        setReordering(true);
        try {
            await reorderCertsAdmin(certIdsInOrder);
            fetchData();
        } catch (e) {
            console.error(e);
            setError(t('admin.certifications.reorderError'));
        } finally {
            setReordering(false);
        }
    };

    const handleOpenDetailsManager = (cert) => {
        setManagingDetailsFor(cert);
    };

    const handleCloseDetailsManager = () => {
        setManagingDetailsFor(null);
        fetchData();
    };

    const handleOpenSkillsManager = (cert) => {
        setManagingSkillsFor(cert);
    };

    const handleCloseSkillsManager = () => {
        setManagingSkillsFor(null);
        fetchData();
    };

    const handleOpenDocumentsManager = (cert) => {
        setManagingDocumentsFor(cert);
    };

    const handleCloseDocumentsManager = () => {
        setManagingDocumentsFor(null);
        fetchData();
    };

    const moveCert = (index, direction) => {
        const newCerts = [...certs];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newCerts.length) return;
        [newCerts[index], newCerts[newIndex]] = [newCerts[newIndex], newCerts[index]];
        setCerts(newCerts);
        handleReorder(newCerts.map(c => c.id));
    };

    const getIssuerName = (issuerId) => {
        if (!issuerId) return '-';
        const issuer = issuers.find(i => i.id === issuerId);
        return issuer ? issuer.name : 'Unknown';
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'VERIFIED': return 'status-verified';
            case 'IN_PROGRESS': return 'status-in-progress';
            case 'PENDING': return 'status-pending';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                {t('admin.certifications.loading')}
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

            {/* Filters */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
                <h3 style={{ marginBottom: 16, color: 'var(--cyan)' }}>{t('admin.certifications.filters')}</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.certifications.filter.status')}
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            style={{
                                background: 'var(--bg-cyber)',
                                border: '1px solid var(--border-card)',
                                borderRadius: 4,
                                color: 'var(--text-main)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                padding: '8px 12px',
                                minWidth: 160
                            }}
                        >
                            <option value="">{t('admin.certifications.filter.allStatus')}</option>
                            <option value="VERIFIED">{t('admin.certifications.status.VERIFIED')}</option>
                            <option value="IN_PROGRESS">{t('admin.certifications.status.IN_PROGRESS')}</option>
                            <option value="PENDING">{t('admin.certifications.status.PENDING')}</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.certifications.filter.publication')}
                        </label>
                        <select
                            value={filters.publicationStatus}
                            onChange={(e) => setFilters(prev => ({ ...prev, publicationStatus: e.target.value }))}
                            style={{
                                background: 'var(--bg-cyber)',
                                border: '1px solid var(--border-card)',
                                borderRadius: 4,
                                color: 'var(--text-main)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                padding: '8px 12px',
                                minWidth: 160
                            }}
                        >
                            <option value="">{t('admin.certifications.filter.allPublication')}</option>
                            <option value="DRAFT">{t('admin.certifications.status.DRAFT')}</option>
                            <option value="PUBLISHED">{t('admin.certifications.status.PUBLISHED')}</option>
                            <option value="UNPUBLISHED">{t('admin.certifications.status.UNPUBLISHED')}</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.certifications.filter.visibility')}
                        </label>
                        <select
                            value={filters.isVisible}
                            onChange={(e) => setFilters(prev => ({ ...prev, isVisible: e.target.value }))}
                            style={{
                                background: 'var(--bg-cyber)',
                                border: '1px solid var(--border-card)',
                                borderRadius: 4,
                                color: 'var(--text-main)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                padding: '8px 12px',
                                minWidth: 160
                            }}
                        >
                            <option value="">{t('admin.certifications.filter.allVisibility')}</option>
                            <option value="true">{t('admin.certifications.visibility.true')}</option>
                            <option value="false">{t('admin.certifications.visibility.false')}</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setFilters({ status: '', publicationStatus: '', isVisible: '' })}
                        className="cyber-btn sec"
                        style={{ height: 'fit-content' }}
                    >
                        {t('admin.certifications.filter.reset')}
                    </button>
                    <button
                        onClick={() => setManagingIssuers(true)}
                        className="cyber-btn"
                        style={{ height: 'fit-content', marginLeft: 'auto' }}
                    >
                        <Plus size={14} style={{ marginRight: 6 }} />
                        {t('admin.issuers.title')}
                    </button>
                </div>
            </div>

            {/* Certifications Table */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: 1100 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--card-bg)' }}>
                                <th style={{ padding: '12px 16px', width: '50px' }}>{t('admin.certifications.table.drag')}</th>
                                <th style={{ padding: '12px 16px', width: '60px' }}>{t('admin.table.id')}</th>
                                <th style={{ padding: '12px 16px' }}>{t('admin.table.title')}</th>
                                <th style={{ padding: '12px 16px', width: '100px' }}>{t('admin.certifications.table.acronym')}</th>
                                <th style={{ padding: '12px 16px', width: '140px' }}>{t('admin.table.issuer')}</th>
                                <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.certifications.table.category')}</th>
                                <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.certifications.table.type')}</th>
                                <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.table.status')}</th>
                                <th style={{ padding: '12px 16px', width: '140px' }}>{t('admin.certifications.table.publication')}</th>
                                <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.certifications.table.visibility')}</th>
                                <th style={{ padding: '12px 16px', width: '280px' }}>{t('admin.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certs.length === 0 ? (
                                <tr>
                                    <td colSpan={11} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {t('admin.certifications.noCertifications')}
                                    </td>
                                </tr>
                            ) : (
                                certs.map((cert, index) => (
                                    <tr key={cert.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => moveCert(index, -1)}
                                                disabled={index === 0 || reordering || saving}
                                                className="icon-btn"
                                                aria-label={t('admin.certifications.moveUp')}
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveCert(index, 1)}
                                                disabled={index === certs.length - 1 || reordering || saving}
                                                className="icon-btn"
                                                aria-label={t('admin.certifications.moveDown')}
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {cert.id}
                                        </td>
                                        <td style={{ padding: '12px 16px', maxWidth: 250 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <strong>{cert.title}</strong>
                                                {cert.shortDescription && (
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-muted)',
                                                        fontWeight: 'normal',
                                                        maxWidth: 180,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {cert.shortDescription}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                                            {cert.acronym || '-'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {getIssuerName(cert.issuerId)}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {cert.category || '-'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {cert.certificationType || '-'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span className={`status-badge ${getStatusBadgeClass(cert.status)}`}>
                                                {t(`admin.certifications.status.${cert.status}`) || cert.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                background: `${PUBLICATION_STATUS_COLORS[cert.publicationStatus]}20`,
                                                color: PUBLICATION_STATUS_COLORS[cert.publicationStatus],
                                                fontSize: '0.75rem',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 'bold',
                                                border: `1px solid ${PUBLICATION_STATUS_COLORS[cert.publicationStatus]}40`
                                            }}>
                                                <span style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: PUBLICATION_STATUS_COLORS[cert.publicationStatus]
                                                }} />
                                                {PUBLICATION_STATUS_LABELS[cert.publicationStatus] || cert.publicationStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                background: cert.isVisible ? 'var(--accent-subtle)' : 'var(--red-subtle)',
                                                color: cert.isVisible ? 'var(--accent)' : 'var(--red)',
                                                fontSize: '0.75rem',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 'bold',
                                                border: cert.isVisible ? '1px solid var(--accent)' : '1px solid var(--red)'
                                            }}>
                                                <span style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: cert.isVisible ? 'var(--accent)' : 'var(--red)'
                                                }} />
                                                {t(`admin.certifications.visibility.${cert.isVisible}`)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => handleOpenDetailsManager(cert)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.certifications.manageDetails')}
                                                    disabled={saving}
                                                >
                                                    <Layers size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenSkillsManager(cert)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.certifications.manageSkills')}
                                                    disabled={saving}
                                                >
                                                    <Hash size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDocumentsManager(cert)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.certifications.manageDocuments')}
                                                    disabled={saving}
                                                >
                                                    <FileText size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setViewingCert(cert)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.certifications.preview')}
                                                    disabled={saving}
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingCert(cert)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.certifications.edit')}
                                                    disabled={saving}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleTogglePublication(cert,
                                                        cert.publicationStatus === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED'
                                                    )}
                                                    className={`cyber-btn sec icon-btn ${cert.publicationStatus === 'PUBLISHED' ? '' : 'accent'}`}
                                                    title={cert.publicationStatus === 'PUBLISHED' ? t('admin.certifications.unpublish') : t('admin.certifications.publish')}
                                                    disabled={saving}
                                                >
                                                    {cert.publicationStatus === 'PUBLISHED' ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleVisibility(cert, !cert.isVisible)}
                                                    className={`cyber-btn sec icon-btn ${cert.isVisible ? '' : 'accent'}`}
                                                    title={cert.isVisible ? t('admin.certifications.hide') : t('admin.certifications.show')}
                                                    disabled={saving}
                                                >
                                                    {cert.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCert(cert.id)}
                                                    className="cyber-btn sec icon-btn danger"
                                                    title={t('admin.certifications.delete')}
                                                    disabled={saving}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Certification Button */}
            <div style={{ marginTop: 20, textAlign: 'right' }}>
                <button onClick={() => setEditingCert({})} className="cyber-btn" disabled={saving}>
                    <Plus size={16} style={{ marginRight: 8 }} />
                    {t('admin.certifications.add')}
                </button>
            </div>

            {/* Certification Form Modal */}
            {editingCert !== null && (
                <CertificationForm
                    cert={editingCert}
                    issuers={issuers}
                    onSave={handleSaveCert}
                    onCancel={() => setEditingCert(null)}
                    isSaving={saving}
                />
            )}

            {/* Certification Preview Modal */}
            {viewingCert && (
                <div className="modal-overlay" onClick={() => setViewingCert(null)} style={{ zIndex: 1000 }}>
                    <div className="modal-content-cyber glass-panel" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setViewingCert(null)} aria-label={t('common.close')}>
                            <XCircle size={20} />
                        </button>
                        <div style={{ padding: 20 }}>
                            <h3 style={{ marginBottom: 20, color: 'var(--cyan)' }}>{t('admin.certifications.previewTitle')} - {viewingCert.title}</h3>
                            <div style={{ border: '1px solid var(--border-card)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-cyber)' }}>
                                <CertificationDetailsManager
                                    certification={viewingCert}
                                    details={viewingCert.details || []}
                                    skills={viewingCert.skills || []}
                                    documents={viewingCert.documents || []}
                                    readOnly={true}
                                    onClose={() => setViewingCert(null)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Manager Modal */}
            {managingDetailsFor && (
                <div className="modal-overlay" onClick={handleCloseDetailsManager} style={{ zIndex: 1000 }}>
                    <div className="modal-content-cyber glass-panel" style={{ maxWidth: '1000px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseDetailsManager} aria-label={t('common.close')}>
                            <XCircle size={20} />
                        </button>
                        <div style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                                <h3 style={{ color: 'var(--cyan)' }}>{t('admin.certDetails.manageDetailsTitle')} - {managingDetailsFor.title}</h3>
                                <button onClick={handleCloseDetailsManager} className="cyber-btn sec" style={{ height: 'fit-content' }}>
                                    {t('common.done')}
                                </button>
                            </div>
                            <CertificationDetailsManager
                                certification={managingDetailsFor}
                                details={managingDetailsFor.details || []}
                                readOnly={false}
                                onDetailsChange={handleCloseDetailsManager}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Skills Manager Modal */}
            {managingSkillsFor && (
                <div className="modal-overlay" onClick={handleCloseSkillsManager} style={{ zIndex: 1000 }}>
                    <div className="modal-content-cyber glass-panel" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseSkillsManager} aria-label={t('common.close')}>
                            <XCircle size={20} />
                        </button>
                        <div style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                                <h3 style={{ color: 'var(--cyan)' }}>{t('admin.certSkills.title')} - {managingSkillsFor.title}</h3>
                                <button onClick={handleCloseSkillsManager} className="cyber-btn sec" style={{ height: 'fit-content' }}>
                                    {t('common.done')}
                                </button>
                            </div>
                            <CertificationSkillsManager
                                certification={managingSkillsFor}
                                skills={managingSkillsFor.skills || []}
                                onSkillsChange={handleCloseSkillsManager}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Documents Manager Modal */}
            {managingDocumentsFor && (
                <div className="modal-overlay" onClick={handleCloseDocumentsManager} style={{ zIndex: 1000 }}>
                    <div className="modal-content-cyber glass-panel" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseDocumentsManager} aria-label={t('common.close')}>
                            <XCircle size={20} />
                        </button>
                        <div style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                                <h3 style={{ color: 'var(--cyan)' }}>{t('admin.certDocuments.title')} - {managingDocumentsFor.title}</h3>
                                <button onClick={handleCloseDocumentsManager} className="cyber-btn sec" style={{ height: 'fit-content' }}>
                                    {t('common.done')}
                                </button>
                            </div>
                            <CertificationDocumentsManager
                                certification={managingDocumentsFor}
                                documents={managingDocumentsFor.documents || []}
                                onDocumentsChange={handleCloseDocumentsManager}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Issuers Manager Modal */}
            {managingIssuers && (
                <div className="modal-overlay" onClick={() => setManagingIssuers(false)} style={{ zIndex: 1000 }}>
                    <div className="modal-content-cyber glass-panel" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setManagingIssuers(false)} aria-label={t('common.close')}>
                            <XCircle size={20} />
                        </button>
                        <div style={{ padding: 20 }}>
                            <CertificationIssuersManager
                                issuers={issuers}
                                onIssuersChange={() => fetchData()}
                                onClose={() => setManagingIssuers(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}