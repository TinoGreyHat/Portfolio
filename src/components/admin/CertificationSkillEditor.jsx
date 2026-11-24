import { useState, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { XCircle, Loader2, Hash } from 'lucide-react';

export default function CertificationSkillEditor({ skill, onSave, onCancel, isSaving }) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        displayOrder: 0
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (skill && skill.id) {
            setFormData({
                name: skill.name || '',
                displayOrder: skill.displayOrder || 0
            });
        } else {
            setFormData({
                name: '',
                displayOrder: 0
            });
        }
        setErrors({});
    }, [skill]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = t('admin.certSkills.form.errors.nameRequired');
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
            displayOrder: skill?.displayOrder || formData.displayOrder
        };

        if (skill?.id) {
            submitData.id = skill.id;
        }

        onSave(submitData);
    };

    const isEditing = skill && skill.id;

    return (
        <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 1100 }}>
            <div className="modal-content-cyber glass-panel" style={{ maxWidth: '500px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onCancel} aria-label={t('common.close')}>
                    <XCircle size={20} />
                </button>

                <form onSubmit={handleSubmit} style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-card)', paddingBottom: 16 }}>
                        <h3 style={{ color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Hash size={20} />
                            {isEditing ? t('admin.certSkills.form.editTitle') : t('admin.certSkills.form.addTitle')}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isEditing ? `ID: ${skill.id}` : t('admin.certSkills.form.newSkill')}
                        </span>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.certSkills.form.name')} <span style={{ color: 'var(--red)' }}>*</span>
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
                            placeholder={t('admin.certSkills.form.namePlaceholder')}
                            autoFocus
                        />
                        {errors.name && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.name}</p>}
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