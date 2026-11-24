import { useState, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { XCircle, Loader2, Globe, Image, CheckCircle } from 'lucide-react';

export default function CertificationIssuerEditor({ issuer, onSave, onCancel, isSaving }) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        website: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (issuer && issuer.id) {
            setFormData({
                name: issuer.name || '',
                logo: issuer.logo || '',
                website: issuer.website || ''
            });
        } else {
            setFormData({
                name: '',
                logo: '',
                website: ''
            });
        }
        setErrors({});
    }, [issuer]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = t('admin.issuers.form.errors.nameRequired');
        if (formData.logo && !isValidUrl(formData.logo)) newErrors.logo = t('admin.issuers.form.errors.invalidLogoUrl');
        if (formData.website && !isValidUrl(formData.website)) newErrors.website = t('admin.issuers.form.errors.invalidWebsiteUrl');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const submitData = {
            ...formData
        };

        if (issuer?.id) {
            submitData.id = issuer.id;
        }

        onSave(submitData);
    };

    const isEditing = issuer && issuer.id;

    return (
        <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 1100 }}>
            <div className="modal-content-cyber glass-panel" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onCancel} aria-label={t('common.close')}>
                    <XCircle size={20} />
                </button>

                <form onSubmit={handleSubmit} style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-card)', paddingBottom: 16 }}>
                        <h3 style={{ color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Globe size={20} />
                            {isEditing ? t('admin.issuers.form.editTitle') : t('admin.issuers.form.addTitle')}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isEditing ? `ID: ${issuer.id}` : t('admin.issuers.form.newIssuer')}
                        </span>
                    </div>

                    {/* Name */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.issuers.form.name')} <span style={{ color: 'var(--red)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                background: 'var(--bg-cyber)',
                                border: `1px solid ${errors.name ? 'var(--red)' : 'var(--border-card)'}`,
                                borderRadius: 4,
                                color: 'var(--text-main)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.9rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            placeholder={t('admin.issuers.form.namePlaceholder')}
                            autoFocus
                        />
                        {errors.name && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.name}</p>}
                    </div>

                    {/* Logo URL */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.issuers.form.logo')} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(URL)</span>
                        </label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                value={formData.logo}
                                onChange={(e) => handleChange('logo', e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px 12px',
                                    background: 'var(--bg-cyber)',
                                    border: `1px solid ${errors.logo ? 'var(--red)' : 'var(--border-card)'}`,
                                    borderRadius: 4,
                                    color: 'var(--text-main)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="https://example.com/logo.png"
                            />
                            {formData.logo && (
                                <img src={formData.logo} alt="Logo preview" style={{ height: '40px', borderRadius: '4px', border: '1px solid var(--border-card)' }} />
                            )}
                        </div>
                        {errors.logo && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.logo}</p>}
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{t('admin.issuers.form.logoHelp')}</p>
                    </div>

                    {/* Website URL */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.issuers.form.website')} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(URL)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.website}
                            onChange={(e) => handleChange('website', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                background: 'var(--bg-cyber)',
                                border: `1px solid ${errors.website ? 'var(--red)' : 'var(--border-card)'}`,
                                borderRadius: 4,
                                color: 'var(--text-main)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.9rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            placeholder="https://example.com"
                        />
                        {errors.website && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.website}</p>}
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{t('admin.issuers.form.websiteHelp')}</p>
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