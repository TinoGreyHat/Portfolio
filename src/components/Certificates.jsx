import { useState, useEffect } from 'react';
import { Award, ExternalLink, Lock, Unlock, ArrowLeft, ChevronDown, ChevronUp, FileText, Hash, Layers, Globe, Calendar, Tag, Shield, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import { loadCerts, loadCert, loadPageSettings } from '../services/apiService';

// Read-only Certificates component

// Helper to render markdown-like content
function renderContent(content, contentType) {
    if (!content) return null;

    switch (contentType) {
        case 'bulletList':
            return (
                <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyle: 'disc' }}>
                    {content.split('\n').filter(line => line.trim().startsWith('-')).map((line, idx) => (
                        <li key={idx} style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                            {line.trim().substring(1).trim()}
                        </li>
                    ))}
                </ul>
            );
        case 'numberedList':
            return (
                <ol style={{ margin: 0, paddingLeft: '1.5rem', listStyle: 'decimal' }}>
                    {content.split('\n').filter(line => line.trim().match(/^\d+\./)).map((line, idx) => (
                        <li key={idx} style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                            {line.trim().replace(/^\d+\.\s*/, '')}
                        </li>
                    ))}
                </ol>
            );
        case 'techList':
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {content.split('\n').filter(line => line.trim()).map((tech, idx) => (
                        <span key={idx} style={{
                            padding: '4px 10px',
                            background: 'var(--accent-subtle)',
                            border: '1px solid var(--accent)',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--accent)'
                        }}>
                            {tech.trim()}
                        </span>
                    ))}
                </div>
            );
        case 'mixed':
            // Simple markdown rendering for mixed content
            return (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {content.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) {
                            return <div key={idx} style={{ marginBottom: '0.5rem' }}><strong style={{ fontSize: '1.1rem', color: 'var(--cyan)' }}>{line.substring(2)}</strong></div>;
                        }
                        if (line.startsWith('## ')) {
                            return <div key={idx} style={{ marginBottom: '0.5rem' }}><strong style={{ fontSize: '1rem', color: 'var(--cyan)' }}>{line.substring(3)}</strong></div>;
                        }
                        if (line.startsWith('### ')) {
                            return <div key={idx} style={{ marginBottom: '0.5rem' }}><strong style={{ fontSize: '0.9rem', color: 'var(--cyan)' }}>{line.substring(4)}</strong></div>;
                        }
                        if (line.startsWith('- ')) {
                            return <div key={idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: 'var(--accent)' }}>▸</span>{line.substring(2)}</div>;
                        }
                        if (line.match(/^\d+\./)) {
                            const match = line.match(/^(\d+\.)/);
                            return <div key={idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>{match[1]}</span>{line.replace(/^\d+\.\s*/, '')}</div>;
                        }
                        if (line.startsWith('```')) {
                            return <div key={idx} style={{ marginBottom: '0.5rem' }}>{line}</div>;
                        }
                        if (line.trim() === '') {
                            return <div key={idx} />;
                        }
                        // Regular paragraph with inline markdown
                        const html = line
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/`([^`]+)`/g, '<code style="background: var(--accent-subtle); padding: 2px 4px; border-radius: 3px; color: var(--accent); font-family: var(--font-mono);">$1</code>');
                        return <div key={idx} style={{ marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: html }} />;
                    })}
                </div>
            );
        default: // paragraph
            return (
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {content}
                </p>
            );
    }
}

export default function Certificates() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const handleBack = () => navigate('/');
    const [certs, setCerts] = useState([]);
    const [pageSettings, setPageSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCert, setExpandedCert] = useState(null);
    const [detailLoading, setDetailLoading] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [cData, pData] = await Promise.all([
                    loadCerts(),
                    loadPageSettings('certifications')
                ]);
                setCerts(cData || []);
                setPageSettings(pData);
            } catch (err) {
                console.error("Erreur de chargement:", err.message);
                setError(err.message);
                setCerts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleExpand = async (cert) => {
        if (expandedCert?.id === cert.id) {
            setExpandedCert(null);
            return;
        }

        // Load full certification data with details, skills, documents
        setDetailLoading(cert.id);
        try {
            const fullCert = await loadCert(cert.id);
            setExpandedCert(fullCert);
        } catch (err) {
            console.error("Erreur de chargement des détails:", err.message);
            setError(err.message);
            setExpandedCert(cert); // Show basic data at least
        } finally {
            setDetailLoading(null);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'VERIFIED': return 'status-verified';
            case 'IN_PROGRESS': return 'status-in-progress';
            case 'PENDING': return 'status-pending';
            default: return '';
        }
    };

    const getStatusLabel = (status) => {
        return t(`certificates.status.${status}`) || status;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'VERIFIED': return <Shield size={12} />;
            case 'IN_PROGRESS': return <Eye size={12} />;
            case 'PENDING': return <Lock size={12} />;
            default: return <Lock size={12} />;
        }
    };

    const getPageTitle = () => {
        if (!pageSettings) return t('certificates.sectionTitle');
        const lang = t('common.lang') || 'fr';
        return lang === 'fr' ? (pageSettings.titleFr || t('certificates.sectionTitle')) : (pageSettings.titleEn || t('certificates.sectionTitle'));
    };

    const getPageDescription = () => {
        if (!pageSettings) return t('certificates.sectionDesc');
        const lang = t('common.lang') || 'fr';
        return lang === 'fr' ? (pageSettings.descriptionFr || t('certificates.sectionDesc')) : (pageSettings.descriptionEn || t('certificates.sectionDesc'));
    };

    const getPageFooter = () => {
        if (!pageSettings) return null;
        const lang = t('common.lang') || 'fr';
        return lang === 'fr' ? pageSettings.footerFr : pageSettings.footerEn;
    };

    if (loading) {
        return (
            <section className="section-container reveal visible">
                <div className="section-header">
                    <button className="page-back-btn" onClick={handleBack} aria-label={t('common.back')}>
                        <ArrowLeft size={18} />
                        <span>{t('common.back')}</span>
                    </button>
                    <h2 className="section-title">
                        <Award className="title-icon" size={28} />
                        {t('certificates.sectionTitle')}
                    </h2>
                </div>
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <p>{t('certificates.loading')}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section-container reveal visible">
            <div className="section-header">
                <button className="page-back-btn" onClick={handleBack} aria-label={t('common.back')}>
                    <ArrowLeft size={18} />
                    <span>{t('common.back')}</span>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <h2 className="section-title">
                        <Award className="title-icon" size={28} />
                        {getPageTitle()}
                        <div className="title-line"></div>
                    </h2>
                </div>
                <p className="section-desc">
                    {getPageDescription()}
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontSize: '0.8rem', marginLeft: 8 }}>
                        {t('certificates.certCount', {
                            count: certs.length,
                            plural: certs.length !== 1 ? t('certificates.certCount_plural') : ''
                        })}
                    </span>
                </p>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', background: 'var(--red-subtle)', border: '1px solid var(--red)', borderRadius: 6, color: 'var(--red)', marginBottom: 20 }}>
                    {error}
                </div>
            )}

            {certs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <p style={{ marginBottom: 8 }}>{t('certificates.noCerts')}</p>
                </div>
            ) : (
                <div className="certs-grid">
                    {certs.map((cert) => (
                        <div key={cert.id} className="cert-card glass-panel" style={{ position: 'relative', overflow: 'visible' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <span className={`cert-status-tag ${getStatusBadgeClass(cert.status)}`} style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {getStatusIcon(cert.status)}
                                            {getStatusLabel(cert.status)}
                                        </span>
                                    </span>

                                    <h3 className="cert-title" style={{ marginTop: 12, marginBottom: 4 }}>{cert.title}</h3>

                                    {cert.acronym && (
                                        <span style={{
                                            display: 'inline-block',
                                            marginBottom: 8,
                                            padding: '2px 8px',
                                            background: 'var(--accent-subtle)',
                                            border: '1px solid var(--accent)',
                                            borderRadius: '4px',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            color: 'var(--accent)',
                                            textTransform: 'uppercase'
                                        }}>
                                            {cert.acronym}
                                        </span>
                                    )}

                                    {cert.shortDescription && (
                                        <p className="cert-short-desc" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12, lineHeight: 1.5 }}>
                                            {cert.shortDescription}
                                        </p>
                                    )}

                                    {/* Issuer with logo */}
                                    <div className="cert-issuer" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                                        {cert.issuer?.logo && (
                                            <img src={cert.issuer.logo} alt={cert.issuer.name} style={{ height: '24px', borderRadius: '4px', border: '1px solid var(--border-card)' }} />
                                        )}
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            {cert.issuer?.name || cert.issuer || t('certificates.unknownIssuer')}
                                        </span>
                                        {cert.issuer?.website && (
                                            <a href={cert.issuer.website} target="_blank" rel="noreferrer" className="cert-verify-link" style={{ fontSize: '0.75rem' }}>
                                                <Globe size={10} />
                                            </a>
                                        )}
                                    </div>

                                    {/* Category & Type */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                                        {cert.category && (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '4px 10px', background: 'var(--card-bg)', border: '1px solid var(--border-card)',
                                                borderRadius: 4, fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)'
                                            }}>
                                                <Tag size={10} /> {cert.category}
                                            </span>
                                        )}
                                        {cert.certificationType && (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '4px 10px', background: 'var(--card-bg)', border: '1px solid var(--border-card)',
                                                borderRadius: 4, fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)'
                                            }}>
                                                <Shield size={10} /> {cert.certificationType}
                                            </span>
                                        )}
                                        {cert.mention && (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '4px 10px', background: 'var(--yellow-subtle)', border: '1px solid var(--yellow)',
                                                borderRadius: 4, fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--yellow)'
                                            }}>
                                                <Shield size={10} /> {cert.mention}
                                            </span>
                                        )}
                                    </div>

                                    {/* Dates */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 12, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {cert.startDate && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Calendar size={10} /> {t('certificates.startDate')}: {cert.startDate}
                                            </span>
                                        )}
                                        {cert.obtainedDate && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Calendar size={10} /> {t('certificates.obtainedDate')}: {cert.obtainedDate}
                                            </span>
                                        )}
                                        {cert.expiryDate && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Calendar size={10} /> {t('certificates.expiryDate')}: {cert.expiryDate}
                                            </span>
                                        )}
                                        {cert.credentialId && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Tag size={10} /> {t('certificates.credentialId')}: {cert.credentialId}
                                            </span>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    {(cert.skills || []).length > 0 && (
                                        <div className="cert-skills" style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {(cert.skills || []).map((skill, idx) => (
                                                <span key={idx} className="cert-skill-tag" style={{ fontSize: '0.7rem' }}>
                                                    {skill.name || skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Documents */}
                                    {(cert.documents || []).length > 0 && (
                                        <div style={{ marginBottom: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                                <FileText size={12} /> {t('certificates.documents')} ({cert.documents.length})
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                {cert.documents.map((doc) => (
                                                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <a
                                                            href={`/api/certifications/${cert.id}/documents/${doc.id}/view`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="cert-doc-link"
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: 6,
                                                                padding: '6px 10px', background: 'var(--card-bg)', border: '1px solid var(--border-card)',
                                                                borderRadius: 4, fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                                                                color: 'var(--text-main)', textDecoration: 'none',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            <FileText size={12} style={{ color: 'var(--red)' }} />
                                                            <span style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {doc.fileName}
                                                            </span>
                                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                                {(doc.fileSize / 1024).toFixed(1)} KB
                                                            </span>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Verification Link */}
                                    {cert.verificationLink && (
                                        <a
                                            href={cert.verificationLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="cert-verify-link"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                                padding: '8px 16px', marginTop: 8,
                                                background: 'var(--accent-subtle)', border: '1px solid var(--accent)',
                                                borderRadius: 6, fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
                                                color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold'
                                            }}
                                        >
                                            <Shield size={14} />
                                            {t('certificates.verify')}
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>

                                {/* Expand Button */}
                                <button
                                    onClick={() => handleExpand(cert)}
                                    disabled={detailLoading === cert.id}
                                    className="cyber-btn sec"
                                    style={{
                                        padding: '8px 12px',
                                        height: 'fit-content',
                                        alignSelf: 'flex-start',
                                        borderRadius: 6
                                    }}
                                    aria-expanded={expandedCert?.id === cert.id}
                                >
                                    {detailLoading === cert.id ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div className="spin" style={{ width: 14, height: 14, border: '2px solid var(--border-card)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
                                            {t('common.loading')}
                                        </span>
                                    ) : expandedCert?.id === cert.id ? (
                                        <>
                                            <ChevronUp size={14} style={{ marginRight: 6 }} />
                                            {t('certificates.collapse')}
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={14} style={{ marginRight: 6 }} />
                                            {t('certificates.expand')}
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Expanded Details */}
                            {expandedCert?.id === cert.id && (
                                <div style={{
                                    marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-card)',
                                    animation: 'slideDown 0.3s ease'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <h4 style={{ color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Layers size={18} />
                                            {t('certificates.detailsTitle')}
                                        </h4>
                                        <button
                                            onClick={() => setExpandedCert(null)}
                                            className="cyber-btn sec icon-btn"
                                            style={{ padding: 6 }}
                                            aria-label={t('common.close')}
                                        >
                                            <EyeOff size={16} />
                                        </button>
                                    </div>

                                    {/* Details Sections */}
                                    {(expandedCert.details || []).length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            {(expandedCert.details || []).map((detail) => (
                                                <div key={detail.id} className="glass-panel" style={{ padding: 16, borderRadius: 8 }}>
                                                    {detail.icon && (
                                                        <span style={{ fontSize: '1.5rem', marginBottom: 8, display: 'inline-block' }}>
                                                            {detail.icon}
                                                        </span>
                                                    )}
                                                    <h5 style={{ color: 'var(--cyan)', marginBottom: 8, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                                                        {detail.title}
                                                    </h5>
                                                    <div style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
                                                        {renderContent(detail.content, detail.contentType)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', textAlign: 'center', padding: 20 }}>
                                            {t('certificates.noDetails')}
                                        </p>
                                    )}

                                    {/* Additional Skills in expanded view */}
                                    {(expandedCert.skills || []).length > 0 && (
                                        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-card)' }}>
                                            <h4 style={{ color: 'var(--cyan)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Hash size={18} />
                                                {t('certificates.skillsTitle')}
                                            </h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                {(expandedCert.skills || []).map((skill, idx) => (
                                                    <span key={idx} style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        padding: '8px 14px', background: 'var(--accent-subtle)', border: '1px solid var(--accent)',
                                                        borderRadius: '20px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)'
                                                    }}>
                                                        {skill.name || skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Page Footer */}
            {getPageFooter() && (
                <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border-card)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {getPageFooter()}
                </div>
            )}
        </section>
    );
}