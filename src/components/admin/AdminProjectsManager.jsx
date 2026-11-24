import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
    Plus, Trash2, Edit, Eye, EyeOff,
    ArrowUp, ArrowDown, GripVertical,
    Loader2, AlertTriangle, CheckCircle, XCircle,
    Copy, Layers, FileText, List, Hash, Terminal
} from 'lucide-react';
import {
    loadProjectsAdmin, saveProjectAdmin, deleteProjectAdmin,
    reorderProjectsAdmin, updateProjectPublicationStatus,
    loadProjectSections, createProjectSection, updateProjectSection,
    deleteProjectSection, reorderProjectSections, duplicateProjectSection
} from '../../services/apiService';
import ProjectForm from './ProjectForm';
import SectionsManager from './SectionsManager';

const PUBLICATION_STATUS_LABELS = {
    DRAFT: 'Brouillon',
    PUBLISHED: 'Publié',
    UNPUBLISHED: 'Dépublié'
};

const PUBLICATION_STATUS_COLORS = {
    DRAFT: 'var(--yellow)',
    PUBLISHED: 'var(--accent)',
    UNPUBLISHED: 'var(--red)'
};

const CONTENT_TYPE_ICONS = {
    paragraph: FileText,
    bulletList: List,
    numberedList: Hash,
    techList: Layers,
    mixed: Terminal
};

export default function AdminProjectsManager({ onRefresh }) {
    const { t } = useI18n();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: '', status: '', publicationStatus: '' });
    const [editingProject, setEditingProject] = useState(null);
    const [viewingProject, setViewingProject] = useState(null);
    const [managingSectionsFor, setManagingSectionsFor] = useState(null);
    const [saving, setSaving] = useState(null);
    const [reordering, setReordering] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await loadProjectsAdmin(filters);
            setProjects(data || []);
        } catch (e) {
            console.error(e);
            setError(t('admin.projects.loadError'));
        } finally {
            setLoading(false);
        }
    }, [filters, t]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSaveProject = async (projectData) => {
        setSaving(projectData.id ? `edit-${projectData.id}` : 'create');
        try {
            await saveProjectAdmin(projectData);
            fetchProjects();
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error(e);
            setError(t('admin.projects.saveError'));
        } finally {
            setSaving(null);
            setEditingProject(null);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm(t('admin.projects.confirmDelete'))) return;
        try {
            await deleteProjectAdmin(id);
            fetchProjects();
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error(e);
            setError(t('admin.projects.deleteError'));
        }
    };

    const handleTogglePublication = async (project, newStatus) => {
        const confirmMsg = t(`admin.projects.confirm${newStatus}`);
        if (!window.confirm(confirmMsg)) return;

        try {
            await updateProjectPublicationStatus(project.id, newStatus);
            fetchProjects();
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error(e);
            setError(t('admin.projects.publicationError'));
        }
    };

    const handleReorder = async (projectIdsInOrder) => {
        setReordering(true);
        try {
            await reorderProjectsAdmin(projectIdsInOrder);
            fetchProjects();
        } catch (e) {
            console.error(e);
            setError(t('admin.projects.reorderError'));
        } finally {
            setReordering(false);
        }
    };

    const handleOpenSectionsManager = (project) => {
        setManagingSectionsFor(project);
    };

    const handleCloseSectionsManager = () => {
        setManagingSectionsFor(null);
        fetchProjects(); // Refresh in case sections changed
    };

    const moveProject = (index, direction) => {
        const newProjects = [...projects];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newProjects.length) return;
        [newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]];
        setProjects(newProjects);
        handleReorder(newProjects.map(p => p.id));
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                {t('admin.projects.loading')}
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
                <h3 style={{ marginBottom: 16, color: 'var(--cyan)' }}>{t('admin.projects.filters')}</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.projects.filter.category')}
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
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
                            <option value="">{t('admin.projects.filter.allCategories')}</option>
                            <option value="pentest">{t('projects.filterPentest')}</option>
                            <option value="defensive">{t('projects.filterDefensive')}</option>
                            <option value="scripting">{t('projects.filterScripting')}</option>
                            <option value="reverse">{t('projects.filterReverse')}</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.projects.filter.status')}
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
                            <option value="">{t('admin.projects.filter.allStatus')}</option>
                            <option value="COMPLETED">{t('projects.badgeCompleted')}</option>
                            <option value="IN_PROGRESS">{t('projects.badgeInProgress')}</option>
                            <option value="PLANNED">{t('projects.badgePlanned')}</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t('admin.projects.filter.publication')}
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
                            <option value="">{t('admin.projects.filter.allPublication')}</option>
                            <option value="DRAFT">{t('admin.projects.status.DRAFT')}</option>
                            <option value="PUBLISHED">{t('admin.projects.status.PUBLISHED')}</option>
                            <option value="UNPUBLISHED">{t('admin.projects.status.UNPUBLISHED')}</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setFilters({ category: '', status: '', publicationStatus: '' })}
                        className="cyber-btn sec"
                        style={{ height: 'fit-content' }}
                    >
                        {t('admin.projects.filter.reset')}
                    </button>
                </div>
            </div>

            {/* Projects Table */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: 900 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--card-bg)' }}>
                                <th style={{ padding: '12px 16px', width: '50px' }}>{t('admin.projects.table.drag')}</th>
                                <th style={{ padding: '12px 16px', width: '60px' }}>{t('admin.table.id')}</th>
                                <th style={{ padding: '12px 16px' }}>{t('admin.table.title')}</th>
                                <th style={{ padding: '12px 16px', width: '140px' }}>{t('admin.table.category')}</th>
                                <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.table.status')}</th>
                                <th style={{ padding: '12px 16px', width: '140px' }}>{t('admin.projects.table.publication')}</th>
                                <th style={{ padding: '12px 16px', width: '80px' }}>{t('admin.projects.table.sections')}</th>
                                <th style={{ padding: '12px 16px', width: '200px' }}>{t('admin.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {t('admin.projects.noProjects')}
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project, index) => (
                                    <tr key={project.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => moveProject(index, -1)}
                                                disabled={index === 0 || reordering || saving}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', transition: 'all 0.2s' }}
                                                aria-label={t('admin.projects.moveUp')}
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveProject(index, 1)}
                                                disabled={index === projects.length - 1 || reordering || saving}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', transition: 'all 0.2s' }}
                                                aria-label={t('admin.projects.moveDown')}
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {project.id}
                                        </td>
                                        <td style={{ padding: '12px 16px', maxWidth: 300 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <strong>{project.title}</strong>
                                                {project.description && (
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-muted)',
                                                        fontWeight: 'normal',
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {project.description}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span className="project-category-badge" style={{
                                                background: `var(--${project.category}-subtle, var(--accent-subtle))`,
                                                color: `var(--${project.category}, var(--accent))`,
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontFamily: 'var(--font-mono)',
                                                textTransform: 'uppercase'
                                            }}>
                                                {project.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span className={`status-badge ${project.status?.toLowerCase().replace('_', '-')}`}>
                                                {t(`projects.badge${project.status === 'COMPLETED' ? 'Completed' : project.status === 'IN_PROGRESS' ? 'InProgress' : 'Planned'}`)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                background: `${PUBLICATION_STATUS_COLORS[project.publicationStatus]}20`,
                                                color: PUBLICATION_STATUS_COLORS[project.publicationStatus],
                                                fontSize: '0.75rem',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 'bold',
                                                border: `1px solid ${PUBLICATION_STATUS_COLORS[project.publicationStatus]}40`
                                            }}>
                                                <span style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: PUBLICATION_STATUS_COLORS[project.publicationStatus]
                                                }} />
                                                {PUBLICATION_STATUS_LABELS[project.publicationStatus] || project.publicationStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                color: project.sections?.length > 0 ? 'var(--accent)' : 'var(--text-muted)',
                                                fontWeight: project.sections?.length > 0 ? 'bold' : 'normal'
                                            }}>
                                                {project.sections?.length || 0} {t('admin.projects.sectionsCount')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => handleOpenSectionsManager(project)}
                                                    className="cyber-btn"
                                                    style={{ padding: '6px 10px' }}
                                                    title={t('admin.projects.manageSections')}
                                                    disabled={saving}
                                                >
                                                    <Layers size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setViewingProject(project)}
                                                    className="cyber-btn sec"
                                                    style={{ padding: '6px 10px' }}
                                                    title={t('admin.projects.preview')}
                                                    disabled={saving}
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingProject(project)}
                                                    className="cyber-btn sec"
                                                    style={{ padding: '6px 10px' }}
                                                    title={t('admin.projects.edit')}
                                                    disabled={saving}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleTogglePublication(project,
                                                        project.publicationStatus === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED'
                                                    )}
                                                    className={`cyber-btn sec ${project.publicationStatus === 'PUBLISHED' ? '' : 'accent'}`}
                                                    style={{ padding: '6px 10px' }}
                                                    title={project.publicationStatus === 'PUBLISHED' ? t('admin.projects.unpublish') : t('admin.projects.publish')}
                                                    disabled={saving}
                                                >
                                                    {project.publicationStatus === 'PUBLISHED' ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    className="cyber-btn sec danger"
                                                    style={{ padding: '6px 10px' }}
                                                    title={t('admin.projects.delete')}
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

            {/* Add Project Button */}
            <div style={{ marginTop: 20, textAlign: 'right' }}>
                <button onClick={() => setEditingProject({})} className="cyber-btn" disabled={saving}>
                    <Plus size={16} style={{ marginRight: 8 }} />
                    {t('admin.projects.add')}
                </button>
            </div>

            {/* Project Form Modal */}
            {editingProject !== null && (
                <ProjectForm
                    project={editingProject}
                    onSave={handleSaveProject}
                    onCancel={() => setEditingProject(null)}
                    isSaving={saving}
                />
            )}

            {/* Project Preview Modal */}
            {viewingProject && (
                <div className="modal-overlay" onClick={() => setViewingProject(null)} style={{ zIndex: 1000 }}>
                    <div className="modal-content-cyber glass-panel" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setViewingProject(null)} aria-label={t('common.close')}>
                            <XCircle size={20} />
                        </button>
                        <div style={{ padding: 20 }}>
                            <h3 style={{ marginBottom: 20, color: 'var(--cyan)' }}>{t('admin.projects.previewTitle')} - {viewingProject.title}</h3>
                            <div style={{ border: '1px solid var(--border-card)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-cyber)' }}>
                                <SectionsManager
                                    project={viewingProject}
                                    sections={viewingProject.sections || []}
                                    readOnly={true}
                                    onClose={() => setViewingProject(null)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sections Manager Modal */}
            {managingSectionsFor && (
                <div className="modal-overlay" onClick={handleCloseSectionsManager} style={{ zIndex: 1000 }}>
                    <div className="modal-content-cyber glass-panel" style={{ maxWidth: '1000px', width: '95%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseSectionsManager} aria-label={t('common.close')}>
                            <XCircle size={20} />
                        </button>
                        <div style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                                <h3 style={{ color: 'var(--cyan)' }}>{t('admin.projects.manageSectionsTitle')} - {managingSectionsFor.title}</h3>
                                <button onClick={handleCloseSectionsManager} className="cyber-btn sec" style={{ height: 'fit-content' }}>
                                    {t('common.done')}
                                </button>
                            </div>
                            <SectionsManager
                                project={managingSectionsFor}
                                sections={managingSectionsFor.sections || []}
                                readOnly={false}
                                onSectionsChange={handleCloseSectionsManager}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

