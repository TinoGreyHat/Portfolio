import { useState, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { XCircle, Loader2, Tag, Plus, Trash2 } from 'lucide-react';

const CATEGORIES = [
    { value: 'pentest', label: 'Pentest' },
    { value: 'defensive', label: 'Defensive' },
    { value: 'scripting', label: 'Scripting' },
    { value: 'reverse', label: 'Reverse Engineering' }
];

const STATUSES = [
    { value: 'COMPLETED', label: 'Terminé' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'PLANNED', label: 'Planifié' }
];

const PUBLICATION_STATUSES = [
    { value: 'DRAFT', label: 'Brouillon' },
    { value: 'PUBLISHED', label: 'Publié' },
    { value: 'UNPUBLISHED', label: 'Dépublié' }
];

export default function ProjectForm({ project, onSave, onCancel, isSaving }) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        title: '',
        category: 'pentest',
        status: 'COMPLETED',
        publicationStatus: 'DRAFT',
        date: new Date().getFullYear().toString(),
        description: '',
        details: '',
        githubLink: '',
        demoLink: '',
        writeupLink: '',
        tags: ['']
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (project && project.id) {
            setFormData({
                title: project.title || '',
                category: project.category || 'pentest',
                status: project.status || 'COMPLETED',
                publicationStatus: project.publicationStatus || 'DRAFT',
                date: project.date || new Date().getFullYear().toString(),
                description: project.description || '',
                details: project.details || '',
                githubLink: project.githubLink || '',
                demoLink: project.demoLink || '',
                writeupLink: project.writeupLink || '',
                tags: (project.tags && project.tags.length > 0) ? [...project.tags] : ['']
            });
        } else {
            // Reset for new project
            setFormData({
                title: '',
                category: 'pentest',
                status: 'COMPLETED',
                publicationStatus: 'DRAFT',
                date: new Date().getFullYear().toString(),
                description: '',
                details: '',
                githubLink: '',
                demoLink: '',
                writeupLink: '',
                tags: ['']
            });
        }
        setErrors({});
    }, [project]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = t('admin.projects.form.errors.titleRequired');
        if (!formData.description.trim()) newErrors.description = t('admin.projects.form.errors.descRequired');
        if (formData.tags.filter(t => t.trim()).length === 0) newErrors.tags = t('admin.projects.form.errors.tagsRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleTagChange = (index, value) => {
        const newTags = [...formData.tags];
        newTags[index] = value;
        setFormData(prev => ({ ...prev, tags: newTags }));
        if (errors.tags) setErrors(prev => ({ ...prev, tags: null }));
    };

    const addTag = () => {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
    };

    const removeTag = (index) => {
        if (formData.tags.length <= 1) return;
        const newTags = formData.tags.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, tags: newTags }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const submitData = {
            ...formData,
            tags: formData.tags.filter(t => t.trim()).map(t => t.trim()),
            displayOrder: project?.displayOrder || 0
        };

        if (project?.id) {
            submitData.id = project.id;
        }

        onSave(submitData);
    };

    const isEditing = project && project.id;

    return (
        <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 1000 }}>
            <div className="modal-content-cyber glass-panel" style={{ maxWidth: '700px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onCancel} aria-label={t('common.close')}>
                    <XCircle size={20} />
                </button>

                <form onSubmit={handleSubmit} style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-card)', paddingBottom: 16 }}>
                        <h3 style={{ color: 'var(--cyan)' }}>
                            {isEditing ? t('admin.projects.form.editTitle') : t('admin.projects.form.addTitle')}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isEditing ? `ID: ${project.id}` : t('admin.projects.form.newProject')}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {/* Title */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.title')} <span style={{ color: 'var(--red)' }}>*</span>
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
                                placeholder={t('admin.projects.form.titlePlaceholder')}
                            />
                            {errors.title && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.title}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.category')}
                            </label>
                            <select
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
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.status')}
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
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Publication Status */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.publicationStatus')}
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
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.date')}
                            </label>
                            <input
                                type="text"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
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
                                placeholder="2024"
                            />
                        </div>

                        {/* Description */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.description')} <span style={{ color: 'var(--red)' }}>*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    background: 'var(--bg-cyber)',
                                    border: `1px solid ${errors.description ? 'var(--red)' : 'var(--border-card)'}`,
                                    borderRadius: 4,
                                    color: 'var(--text-main)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    minHeight: 80
                                }}
                                placeholder={t('admin.projects.form.descriptionPlaceholder')}
                            />
                            {errors.description && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.description}</p>}
                        </div>

                        {/* Details */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.details')}
                            </label>
                            <textarea
                                value={formData.details}
                                onChange={(e) => handleChange('details', e.target.value)}
                                rows={6}
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
                                    minHeight: 120
                                }}
                                placeholder={t('admin.projects.form.detailsPlaceholder')}
                            />
                        </div>

                        {/* Links */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.githubLink')}
                            </label>
                            <input
                                type="url"
                                value={formData.githubLink}
                                onChange={(e) => handleChange('githubLink', e.target.value)}
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
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.demoLink')}
                            </label>
                            <input
                                type="url"
                                value={formData.demoLink}
                                onChange={(e) => handleChange('demoLink', e.target.value)}
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
                                placeholder="https://demo.example.com"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.writeupLink')}
                            </label>
                            <input
                                type="url"
                                value={formData.writeupLink}
                                onChange={(e) => handleChange('writeupLink', e.target.value)}
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
                                placeholder="https://writeup.example.com"
                            />
                        </div>

                        {/* Tags */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.projects.form.tags')} <span style={{ color: 'var(--red)' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                                {formData.tags.map((tag, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <input
                                            type="text"
                                            value={tag}
                                            onChange={(e) => handleTagChange(index, e.target.value)}
                                            style={{
                                                padding: '6px 10px',
                                                background: 'var(--bg-cyber)',
                                                border: `1px solid ${errors.tags ? 'var(--red)' : 'var(--border-card)'}`,
                                                borderRadius: 4,
                                                color: 'var(--text-main)',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '0.85rem',
                                                outline: 'none',
                                                minWidth: 120,
                                                flex: 1
                                            }}
                                            placeholder={index === 0 ? t('admin.projects.form.tagPlaceholder') : ''}
                                        />
                                        {formData.tags.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTag(index)}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: '2px' }}
                                                aria-label={t('admin.projects.form.removeTag')}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addTag} className="cyber-btn sec" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                                <Plus size={14} style={{ marginRight: 6 }} />
                                {t('admin.projects.form.addTag')}
                            </button>
                            {errors.tags && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.tags}</p>}
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