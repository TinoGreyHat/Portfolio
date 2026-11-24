import { useState, useEffect, useCallback, useRef } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
    Plus, Trash2, Eye, Download, Loader2,
    AlertTriangle, FileText, XCircle
} from 'lucide-react';
import {
    loadCertDocuments, uploadCertDocument, deleteCertDocument
} from '../../services/apiService';

export default function CertificationDocumentsManager({ certification, documents: initialDocuments, onDocumentsChange }) {
    const { t } = useI18n();
    const [documents, setDocuments] = useState(initialDocuments || []);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (certification?.id && documents.length === 0) {
            loadDocuments();
        } else if (initialDocuments) {
            setDocuments(initialDocuments);
        }
    }, [certification?.id, initialDocuments]);

    const loadDocuments = async () => {
        if (!certification?.id) return;
        setLoading(true);
        try {
            const data = await loadCertDocuments(certification.id);
            setDocuments(data || []);
        } catch (e) {
            console.error(e);
            setError(t('admin.certDocuments.loadError') || 'Error loading documents');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                setError(t('admin.certDocuments.uploadError') || 'Only PDF files are allowed');
                return;
            }
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size exceeds 10MB limit');
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError(null);
        try {
            const document = await uploadCertDocument(certification.id, selectedFile);
            setDocuments(prev => [...prev, document]);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (onDocumentsChange) onDocumentsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.certDocuments.uploadError') || 'Error uploading document');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!window.confirm(t('admin.certDocuments.confirmDelete') || 'Delete this document?')) return;

        setDeleting(documentId);
        try {
            await deleteCertDocument(certification.id, documentId);
            setDocuments(prev => prev.filter(d => d.id !== documentId));
            if (onDocumentsChange) onDocumentsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.certDocuments.deleteError') || 'Error deleting document');
        } finally {
            setDeleting(null);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleView = (documentId) => {
        // Open in new tab
        window.open(`/api/certifications/${certification.id}/documents/${documentId}/view`, '_blank');
    };

    const handleDownload = (documentId, fileName) => {
        // Trigger download
        const link = document.createElement('a');
        link.href = `/api/certifications/${certification.id}/documents/${documentId}/download`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                {t('admin.certDocuments.loading') || 'Loading documents...'}
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

            {/* Upload Area */}
            <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
                <h4 style={{ marginBottom: 16, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={18} />
                    {t('admin.certDocuments.upload')}
                </h4>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <label className="cyber-btn sec" style={{ cursor: 'pointer' }}>
                            <Plus size={14} style={{ marginRight: 6 }} />
                            {t('admin.certDocuments.selectFile') || 'Select PDF'}
                        </label>
                        {selectedFile && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>
                                {selectedFile.name} ({formatFileSize(selectedFile.size)})
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="cyber-btn"
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={14} className="spin" style={{ marginRight: 8 }} />
                                {t('common.uploading') || 'Uploading...'}
                            </>
                        ) : (
                            <>
                                <Plus size={14} style={{ marginRight: 6 }} />
                                {t('admin.certDocuments.upload')}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Documents List */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                {documents.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <FileText size={32} style={{ marginBottom: 16, color: 'var(--accent)', opacity: 0.5 }} />
                        <p style={{ marginBottom: 16, fontFamily: 'var(--font-mono)' }}>{t('admin.certDocuments.noDocuments')}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: 700 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--card-bg)' }}>
                                    <th style={{ padding: '12px 16px', width: '60px' }}>{t('admin.table.id')}</th>
                                    <th style={{ padding: '12px 16px' }}>{t('admin.certDocuments.table.fileName')}</th>
                                    <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.certDocuments.table.fileSize')}</th>
                                    <th style={{ padding: '12px 16px', width: '160px' }}>{t('admin.certDocuments.table.uploadedAt')}</th>
                                    <th style={{ padding: '12px 16px', width: '160px' }}>{t('admin.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((doc) => (
                                    <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {doc.id}
                                        </td>
                                        <td style={{ padding: '12px 16px', maxWidth: 300 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <FileText size={16} style={{ color: 'var(--red)' }} />
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {doc.fileName}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {formatFileSize(doc.fileSize)}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {formatDate(doc.createdAt)}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => handleView(doc.id)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.certDocuments.view')}
                                                    disabled={deleting === doc.id}
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(doc.id, doc.fileName)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.certDocuments.download')}
                                                    disabled={deleting === doc.id}
                                                >
                                                    <Download size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="cyber-btn sec icon-btn danger"
                                                    title={t('admin.certDocuments.delete')}
                                                    disabled={deleting === doc.id}
                                                >
                                                    {deleting === doc.id ? (
                                                        <Loader2 size={14} className="spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}
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
        </div>
    );
}