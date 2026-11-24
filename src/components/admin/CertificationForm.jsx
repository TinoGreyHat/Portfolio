import { useState, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { XCircle, Loader2, Tag, Plus, Trash2, Image, Link, Calendar, Shield, Award, Globe } from 'lucide-react';

const STATUSES = [
    { value: 'VERIFIED', label: 'Verified' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'PENDING', label: 'Pending' }
];

const PUBLICATION_STATUSES = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'UNPUBLISHED', label: 'Unpublished' }
];

export default function CertificationForm({ cert, issuers, onSave, onCancel, isSaving }) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        title: '',
        acronym: '',
        issuerId: '',
        category: '',
        certificationType: '',
        shortDescription: '',
        startDate: '',
        obtainedDate: new Date().getFullYear().toString(),
        expiryDate: '',
        credentialId: '',
        status: 'VERIFIED',
        mention: '',
        verificationLink: '',
        logo: '',
        publicationStatus: 'DRAFT',
        isVisible: true,
        displayOrder: 0
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (cert && cert.id) {
            setFormData({
                title: cert.title || '',
                acronym: cert.acronym || '',
                issuerId: cert.issuerId || '',
                category: cert.category || '',
                certificationType: cert.certificationType || '',
                shortDescription: cert.shortDescription || '',
                startDate: cert.startDate || '',
                obtainedDate: cert.obtainedDate || new Date().getFullYear().toString(),
                expiryDate: cert.expiryDate || '',
                credentialId: cert.credentialId || '',
                status: cert.status || 'VERIFIED',
                mention: cert.mention || '',
                verificationLink: cert.verificationLink || '',
                logo: cert.logo || '',
                publicationStatus: cert.publicationStatus || 'DRAFT',
                isVisible: cert.isVisible !== false,
                displayOrder: cert.displayOrder || 0
            });
        } else {
            // Reset for new certification
            setFormData({
                title: '',
                acronym: '',
                issuerId: '',
                category: '',
                certificationType: '',
                shortDescription: '',
                startDate: '',
                obtainedDate: new Date().getFullYear().toString(),
                expiryDate: '',
                credentialId: '',
                status: 'VERIFIED',
                mention: '',
                verificationLink: '',
                logo: '',
                publicationStatus: 'DRAFT',
                isVisible: true,
                displayOrder: 0
            });
        }
        setErrors({});
    }, [cert]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = t('admin.certifications.form.errors.titleRequired');
        if (!formData.issuerId) newErrors.issuerId = t('admin.certifications.form.errors.issuerRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const submitData = {
            ...formData,
            issuerId: formData.issuerId ? parseInt(formData.issuerId, 10) : null,
            displayOrder: cert?.displayOrder || formData.displayOrder
        };

        if (cert?.id) {
            submitData.id = cert.id;
        }

        onSave(submitData);
    };

    const isEditing = cert && cert.id;

    return (
        <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 1000 }}>
            <div className="modal-content-cyber glass-panel" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onCancel} aria-label={t('common.close')}>
                    <XCircle size={20} />
                </button>

                <form onSubmit={handleSubmit} style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-card)', paddingBottom: 16 }}>
                        <h3 style={{ color: 'var(--cyan)' }}>
                            {isEditing ? t('admin.certifications.form.editTitle') : t('admin.certifications.form.addTitle')}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isEditing ? `ID: ${cert.id}` : t('admin.certifications.form.newCertification')}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {/* Title */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.title')} <span style={{ color: 'var(--red)' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    background: 'var(--bg-cyber)',
                                    border: `1px solid ${errors.title ? 'var(--red)' : 'var(--border-card)'}`,
                                    borderRadius: 4,
                                    color: 'var(--text-main)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder={t('admin.certifications.form.titlePlaceholder')}
                            />
                            {errors.title && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.title}</p>}
                        </div>

                        {/* Acronym */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.acronym')} <Award size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                            </label>
                            <input
                                type="text"
                                value={formData.acronym}
                                onChange={(e) => handleChange('acronym', e.target.value)}
                                maxLength={20}
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
                                    boxSizing: 'border-box',
                                    textTransform: 'uppercase'
                                }}
                                placeholder={t('admin.certifications.form.acronymPlaceholder')}
                            />
                        </div>

                        {/* Issuer */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.issuer')} <span style={{ color: 'var(--red)' }}>*</span>
                            </label>
                            <select
                                value={formData.issuerId}
                                onChange={(e) => handleChange('issuerId', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    background: 'var(--bg-cyber)',
                                    border: `1px solid ${errors.issuerId ? 'var(--red)' : 'var(--border-card)'}`,
                                    borderRadius: 4,
                                    color: 'var(--text-main)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value="">{t('admin.certifications.form.selectIssuer')}</option>
                                {issuers.map(issuer => (
                                    <option key={issuer.id} value={issuer.id}>{issuer.name}</option>
                                ))}
                            </select>
                            {errors.issuerId && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.issuerId}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.category')}
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
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
                                placeholder={t('admin.certifications.form.categoryPlaceholder')}
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.type')}
                            </label>
                            <input
                                type="text"
                                value={formData.certificationType}
                                onChange={(e) => handleChange('certificationType', e.target.value)}
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
                                placeholder={t('admin.certifications.form.typePlaceholder')}
                            />
                        </div>

                        {/* Short Description */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.shortDescription')}
                            </label>
                            <textarea
                                value={formData.shortDescription}
                                onChange={(e) => handleChange('shortDescription', e.target.value)}
                                rows={3}
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
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    minHeight: 80
                                }}
                                placeholder={t('admin.certifications.form.shortDescriptionPlaceholder')}
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.startDate')} <Calendar size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                            </label>
                            <input
                                type="text"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
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
                                placeholder={t('admin.certifications.form.startDatePlaceholder')}
                            />
                        </div>

                        {/* Obtained Date */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.obtainedDate')} <Calendar size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                            </label>
                            <input
                                type="text"
                                value={formData.obtainedDate}
                                onChange={(e) => handleChange('obtainedDate', e.target.value)}
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
                                placeholder={t('admin.certifications.form.obtainedDatePlaceholder')}
                            />
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.expiryDate')} <Calendar size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                            </label>
                            <input
                                type="text"
                                value={formData.expiryDate}
                                onChange={(e) => handleChange('expiryDate', e.target.value)}
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
                                placeholder={t('admin.certifications.form.expiryDatePlaceholder')}
                            />
                        </div>

                        {/* Credential ID */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.credentialId')} <Shield size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                            </label>
                            <input
                                type="text"
                                value={formData.credentialId}
                                onChange={(e) => handleChange('credentialId', e.target.value)}
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
                                placeholder={t('admin.certifications.form.credentialIdPlaceholder')}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.status')}
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
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
                            >
                                {STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{t(`admin.certifications.status.${s.value}`) || s.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mention */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.mention')} <Shield size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                            </label>
                            <input
                                type="text"
                                value={formData.mention}
                                onChange={(e) => handleChange('mention', e.target.value)}
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
                                placeholder={t('admin.certifications.form.mentionPlaceholder')}
                            />
                        </div>

                        {/* Verification Link */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.verificationLink')} <ExternalLink size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                            </label>
                            <input
                                type="url"
                                value={formData.verificationLink}
                                onChange={(e) => handleChange('verificationLink', e.target.value)}
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
                                placeholder={t('admin.certifications.form.verificationLinkPlaceholder')}
                            />
                        </div>

                        {/* Logo URL */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.logo')} <Image size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                            </label>
                            <input
                                type="url"
                                value={formData.logo}
                                onChange={(e) => handleChange('logo', e.target.value)}
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
                                placeholder={t('admin.certifications.form.logoPlaceholder')}
                            />
                        </div>

                        {/* Publication Status */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.publicationStatus')}
                            </label>
                            <select
                                value={formData.publicationStatus}
                                onChange={(e) => handleChange('publicationStatus', e.target.value)}
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
                            >
                                {PUBLICATION_STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{t(`admin.certifications.status.${s.value}`) || s.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Visibility */}
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isVisible}
                                    onChange={(e) => handleChange('isVisible', e.target.checked)}
                                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                                />
                                {t('admin.certifications.form.isVisible')}
                            </label>
                        </div>

                        {/* Display Order */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certifications.form.displayOrder')}
                            </label>
                            <input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => handleChange('displayOrder', parseInt(e.target.value, 10) || 0)}
                                min={0}
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
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-card)' }}>
                        <button type="button" onClick={onCancel} className="cyber-btn sec" disabled={isSaving}>
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="cyber-btn" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 size={14} className="spin" style={{ marginRight: 8 }} />
                                    {t('common.saving')}
                                </>
                            ) : (
                                <>
                                    {t('common.save')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}