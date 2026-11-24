import { useState, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { XCircle, Loader2, Terminal, FileText, List, Hash, Layers } from 'lucide-react';

const CONTENT_TYPE_LABELS = {
    paragraph: 'Paragraphe (texte simple)',
    bulletList: 'Liste à puces',
    numberedList: 'Liste numérotée',
    techList: 'Liste de technologies',
    mixed: 'Contenu mixte (Markdown)'
};

const CONTENT_TYPE_ICONS = {
    paragraph: FileText,
    bulletList: List,
    numberedList: Hash,
    techList: Layers,
    mixed: Terminal
};

const CONTENT_TYPE_PLACEHOLDERS = {
    paragraph: 'Rédigez votre paragraphe ici...',
    bulletList: '- Point 1\n- Point 2\n- Point 3',
    numberedList: '1. Première étape\n2. Deuxième étape\n3. Troisième étape',
    techList: 'React\nNode.js\nPostgreSQL\nDocker',
    mixed: '# Titre\n\nTexte en **gras** et *italique*.\n\n- Liste\n- Points\n\n`code inline`\n\n```js\nconst code = "block";\n```'
};

export default function SectionEditor({ section, onSave, onCancel, isSaving, contentTypes }) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        title: '',
        contentType: 'paragraph',
        icon: '',
        content: '',
        displayOrder: 0
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (section && section.id) {
            setFormData({
                title: section.title || '',
                contentType: section.contentType || 'paragraph',
                icon: section.icon || '',
                content: section.content || '',
                displayOrder: section.displayOrder || 0
            });
        } else {
            // New section - default to end
            setFormData({
                title: '',
                contentType: 'paragraph',
                icon: '',
                content: '',
                displayOrder: 0
            });
        }
        setErrors({});
    }, [section]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = t('admin.sections.form.errors.titleRequired');
        if (!formData.content.trim()) newErrors.content = t('admin.sections.form.errors.contentRequired');
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
            displayOrder: section?.displayOrder || formData.displayOrder
        };

        if (section?.id) {
            submitData.id = section.id;
        }

        onSave(submitData);
    };

    const isEditing = section && section.id;

    const ContentTypeIcon = ({ type }) => {
        const Icon = CONTENT_TYPE_ICONS[type] || FileText;
        return <Icon size={14} />;
    };

    return (
        <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 1100 }}>
            <div className="modal-content-cyber glass-panel" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onCancel} aria-label={t('common.close')}>
                    <XCircle size={20} />
                </button>

                <form onSubmit={handleSubmit} style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-card)', paddingBottom: 16 }}>
                        <h3 style={{ color: 'var(--cyan)' }}>
                            {isEditing ? t('admin.sections.form.editTitle') : t('admin.sections.form.addTitle')}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isEditing ? `ID: ${section.id}` : t('admin.sections.form.newSection')}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        {/* Title */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.sections.form.title')} <span style={{ color: 'var(--red)' }}>*</span>
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
                                placeholder={t('admin.sections.form.titlePlaceholder')}
                            />
                            {errors.title && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.title}</p>}
                        </div>

                        {/* Content Type */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.sections.form.contentType')}
                            </label>
                            <select
                                value={formData.contentType}
                                onChange={(e) => handleChange('contentType', e.target.value)}
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
                                {contentTypes.map(type => (
                                    <option key={type} value={type}>
                                        {CONTENT_TYPE_LABELS[type] || type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Icon */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.sections.form.icon')} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(emoji ou court)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) => handleChange('icon', e.target.value)}
                                maxLength={10}
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
                                placeholder="🔧 ou SEC"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.sections.form.content')} <span style={{ color: 'var(--red)' }}>*</span>
                        </label>

                        {/* Content Type Indicator */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 8,
                            padding: '8px 12px',
                            background: 'var(--accent-subtle)',
                            border: '1px solid var(--accent)',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)'
                        }}>
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
                                <ContentTypeIcon type={formData.contentType} />
                            </span>
                            <span>{CONTENT_TYPE_LABELS[formData.contentType] || formData.contentType}</span>
                        </div>

                        <textarea
                            value={formData.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            rows={12}
                            spellCheck={false}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--bg-cyber)',
                                border: `1px solid ${errors.content ? 'var(--red)' : 'var(--border-card)'}`,
                                borderRadius: 4,
                                color: 'var(--text-main)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                                minHeight: 200,
                                lineHeight: 1.6
                            }}
                            placeholder={CONTENT_TYPE_PLACEHOLDERS[formData.contentType] || CONTENT_TYPE_PLACEHOLDERS.paragraph}
                        />
                        {errors.content && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.content}</p>}

                        {/* Content Type Help */}
                        <div style={{ marginTop: 8, padding: 12, background: 'var(--card-bg)', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>
                            <h5 style={{ marginBottom: 8, fontSize: '0.8rem', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.sections.form.contentGuide')}
                            </h5>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.8, fontFamily: 'var(--font-mono)' }}>
                                {getContentTypeHelp(formData.contentType, t)}
                            </div>
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

function getContentTypeHelp(type, t) {
    switch (type) {
        case 'paragraph':
            return t('admin.sections.form.help.paragraph');
        case 'bulletList':
            return t('admin.sections.form.help.bulletList');
        case 'numberedList':
            return t('admin.sections.form.help.numberedList');
        case 'techList':
            return t('admin.sections.form.help.techList');
        case 'mixed':
            return t('admin.sections.form.help.mixed');
        default:
            return '';
    }
}