import { useState, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { XCircle, Loader2, Terminal, FileText, List, Hash, Layers } from 'lucide-react';

const CONTENT_TYPE_LABELS = {
    paragraph: 'Paragraph (simple text)',
    bulletList: 'Bullet List',
    numberedList: 'Numbered List',
    techList: 'Technology List',
    mixed: 'Mixed Content (Markdown)'
};

const CONTENT_TYPE_ICONS = {
    paragraph: FileText,
    bulletList: List,
    numberedList: Hash,
    techList: Layers,
    mixed: Terminal
};

const CONTENT_TYPE_PLACEHOLDERS = {
    paragraph: 'Write your paragraph here...',
    bulletList: '- Point 1\n- Point 2\n- Point 3',
    numberedList: '1. First step\n2. Second step\n3. Third step',
    techList: 'React\nNode.js\nPostgreSQL\nDocker',
    mixed: '# Title\n\nText in **bold** and *italic*.\n\n- List\n- Points\n\n`inline code`\n\n```js\nconst code = "block";\n```'
};

export default function CertificationDetailEditor({ detail, onSave, onCancel, isSaving, contentTypes }) {
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
        if (detail && detail.id) {
            setFormData({
                title: detail.title || '',
                contentType: detail.contentType || 'paragraph',
                icon: detail.icon || '',
                content: detail.content || '',
                displayOrder: detail.displayOrder || 0
            });
        } else {
            setFormData({
                title: '',
                contentType: 'paragraph',
                icon: '',
                content: '',
                displayOrder: 0
            });
        }
        setErrors({});
    }, [detail]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = t('admin.certDetails.form.errors.titleRequired');
        if (!formData.content.trim()) newErrors.content = t('admin.certDetails.form.errors.contentRequired');
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
            displayOrder: detail?.displayOrder || formData.displayOrder
        };

        if (detail?.id) {
            submitData.id = detail.id;
        }

        onSave(submitData);
    };

    const isEditing = detail && detail.id;

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
                            {isEditing ? t('admin.certDetails.form.editTitle') : t('admin.certDetails.form.addTitle')}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isEditing ? `ID: ${detail.id}` : t('admin.certDetails.form.newDetail')}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        {/* Title */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certDetails.form.title')} <span style={{ color: 'var(--red)' }}>*</span>
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
                                placeholder={t('admin.certDetails.form.titlePlaceholder')}
                            />
                            {errors.title && <p style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{errors.title}</p>}
                        </div>

                        {/* Content Type */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {t('admin.certDetails.form.contentType')}
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
                                {t('admin.certDetails.form.icon')} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(emoji or short code)</span>
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
                                placeholder="🔧 or SEC"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.certDetails.form.content')} <span style={{ color: 'var(--red)' }}>*</span>
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
                                {t('admin.certDetails.form.contentGuide')}
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
            return t('admin.certDetails.form.help.paragraph');
        case 'bulletList':
            return t('admin.certDetails.form.help.bulletList');
        case 'numberedList':
            return t('admin.certDetails.form.help.numberedList');
        case 'techList':
            return t('admin.certDetails.form.help.techList');
        case 'mixed':
            return t('admin.certDetails.form.help.mixed');
        default:
            return '';
    }
}