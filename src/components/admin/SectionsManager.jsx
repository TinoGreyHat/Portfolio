import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
    Plus, Trash2, Edit, Copy, GripVertical,
    Loader2, ArrowUp, ArrowDown, Eye, EyeOff,
    FileText, List, Hash, Layers, Terminal,
    AlertTriangle, CheckCircle
} from 'lucide-react';
import {
    loadProjectSections, createProjectSection, updateProjectSection,
    deleteProjectSection, reorderProjectSections, duplicateProjectSection
} from '../../services/apiService';
import SectionEditor from './SectionEditor';

const CONTENT_TYPE_LABELS = {
    paragraph: 'Paragraphe',
    bulletList: 'Liste à puces',
    numberedList: 'Liste numérotée',
    techList: 'Liste technologies',
    mixed: 'Contenu mixte'
};

const CONTENT_TYPE_ICONS = {
    paragraph: FileText,
    bulletList: List,
    numberedList: Hash,
    techList: Layers,
    mixed: Terminal
};

export default function SectionsManager({ project, sections: initialSections, readOnly, onSectionsChange }) {
    const { t } = useI18n();
    const [sections, setSections] = useState(initialSections || []);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [error, setError] = useState(null);

    // Load sections on mount and when project changes
    useEffect(() => {
        if (project?.id && sections.length === 0) {
            loadSections();
        } else if (initialSections) {
            setSections(initialSections);
        }
    }, [project?.id, initialSections]);

    const loadSections = async () => {
        if (!project?.id) return;
        setLoading(true);
        try {
            const data = await loadProjectSections(project.id);
            setSections(data || []);
        } catch (e) {
            console.error(e);
            setError(t('admin.sections.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSection = async (sectionData) => {
        const isUpdate = sectionData.id;
        setSaving(sectionData.id || 'create');
        try {
            let savedSection;
            if (isUpdate) {
                savedSection = await updateProjectSection(project.id, sectionData.id, sectionData);
            } else {
                savedSection = await createProjectSection(project.id, sectionData);
            }

            if (isUpdate) {
                setSections(prev => prev.map(s => s.id === savedSection.id ? savedSection : s));
            } else {
                setSections(prev => [...prev, savedSection]);
            }

            if (onSectionsChange) onSectionsChange();
            setEditingSection(null);
        } catch (e) {
            console.error(e);
            setError(t('admin.sections.saveError'));
        } finally {
            setSaving(null);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm(t('admin.sections.confirmDelete'))) return;

        try {
            await deleteProjectSection(project.id, sectionId);
            setSections(prev => prev.filter(s => s.id !== sectionId));
            if (onSectionsChange) onSectionsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.sections.deleteError'));
        }
    };

    const handleDuplicateSection = async (sectionId) => {
        try {
            setSaving(`duplicate-${sectionId}`);
            const duplicated = await duplicateProjectSection(project.id, sectionId);
            setSections(prev => {
                const index = prev.findIndex(s => s.id === sectionId);
                return [...prev.slice(0, index + 1), duplicated, ...prev.slice(index + 1)];
            });
            if (onSectionsChange) onSectionsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.sections.duplicateError'));
        } finally {
            setSaving(null);
        }
    };

    const handleReorder = async (sectionIdsInOrder) => {
        try {
            await reorderProjectSections(project.id, sectionIdsInOrder);
            // Reorder local state
            const sectionMap = new Map(sections.map(s => [s.id, s]));
            const reordered = sectionIdsInOrder.map(id => sectionMap.get(id)).filter(Boolean);
            setSections(reordered);
        } catch (e) {
            console.error(e);
            setError(t('admin.sections.reorderError'));
            loadSections(); // Reload to restore correct order
        }
    };

    const moveSection = (index, direction) => {
        const newSections = [...sections];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newSections.length) return;
        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        setSections(newSections);
        handleReorder(newSections.map(s => s.id));
    };

    const ContentTypeIcon = ({ type }) => {
        const Icon = CONTENT_TYPE_ICONS[type] || FileText;
        return <Icon size={14} />;
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                {t('admin.sections.loading')}
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

            {/* Sections List */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
                {sections.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: 16, fontFamily: 'var(--font-mono)' }}>{t('admin.sections.noSections')}</p>
                        {!readOnly && (
                            <button onClick={() => setEditingSection({})} className="cyber-btn">
                                <Plus size={16} style={{ marginRight: 8 }} />
                                {t('admin.sections.addFirst')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: 800 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--card-bg)' }}>
                                    <th style={{ padding: '12px 16px', width: '50px' }}>{t('admin.sections.table.drag')}</th>
                                    <th style={{ padding: '12px 16px', width: '60px' }}>{t('admin.table.id')}</th>
                                    <th style={{ padding: '12px 16px', width: '50px' }}>{t('admin.sections.table.type')}</th>
                                    <th style={{ padding: '12px 16px' }}>{t('admin.sections.table.title')}</th>
                                    <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.sections.table.icon')}</th>
                                    <th style={{ padding: '12px 16px', width: '200px' }}>{t('admin.sections.table.content')}</th>
                                    <th style={{ padding: '12px 16px', width: '180px' }}>{t('admin.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.map((section, index) => (
                                    <tr key={section.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            {!readOnly && (
                                                <>
                                                    <button
                                                        onClick={() => moveSection(index, -1)}
                                                        disabled={index === 0 || saving}
                                                        className="icon-btn"
                                                        aria-label={t('admin.sections.moveUp')}
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveSection(index, 1)}
                                                        disabled={index === sections.length - 1 || saving}
                                                        className="icon-btn"
                                                        aria-label={t('admin.sections.moveDown')}
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {section.id}
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
                                                <ContentTypeIcon type={section.contentType} />
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', maxWidth: 200 }}>
                                            <strong style={{ display: 'block', marginBottom: 2 }}>{section.title}</strong>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                                                {CONTENT_TYPE_LABELS[section.contentType] || section.contentType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            {section.icon ? (
                                                <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t('admin.sections.noIcon')}</span>
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
                                                {section.content && section.content.substring(0, 100)}{section.content && section.content.length > 100 ? '...' : ''}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                {!readOnly && (
                                                    <>
                                                        <button
                                                            onClick={() => setEditingSection(section)}
                                                            className="cyber-btn sec icon-btn"
                                                            title={t('admin.sections.edit')}
                                                            disabled={saving}
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDuplicateSection(section.id)}
                                                            className="cyber-btn sec icon-btn"
                                                            title={t('admin.sections.duplicate')}
                                                            disabled={saving}
                                                        >
                                                            <Copy size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSection(section.id)}
                                                            className="cyber-btn sec icon-btn danger"
                                                            title={t('admin.sections.delete')}
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
                    <button onClick={() => setEditingSection({})} className="cyber-btn" disabled={saving}>
                        <Plus size={16} style={{ marginRight: 8 }} />
                        {t('admin.sections.addSection')}
                    </button>
                </div>
            )}

            {/* Section Editor Modal */}
            {editingSection !== null && (
                <SectionEditor
                    section={editingSection}
                    onSave={handleSaveSection}
                    onCancel={() => setEditingSection(null)}
                    isSaving={saving}
                    contentTypes={Object.keys(CONTENT_TYPE_LABELS)}
                />
            )}
        </div>
    );
}