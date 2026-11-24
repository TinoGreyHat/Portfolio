import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
    Plus, Trash2, Edit, GripVertical,
    Loader2, ArrowUp, ArrowDown,
    AlertTriangle, CheckCircle, Hash
} from 'lucide-react';
import {
    loadCertSkills, saveCertSkill, deleteCertSkill, reorderCertSkills
} from '../../services/apiService';
import CertificationSkillEditor from './CertificationSkillEditor';

export default function CertificationSkillsManager({ certification, skills: initialSkills, onSkillsChange }) {
    const { t } = useI18n();
    const [skills, setSkills] = useState(initialSkills || []);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(null);
    const [editingSkill, setEditingSkill] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (certification?.id && skills.length === 0) {
            loadSkills();
        } else if (initialSkills) {
            setSkills(initialSkills);
        }
    }, [certification?.id, initialSkills]);

    const loadSkills = async () => {
        if (!certification?.id) return;
        setLoading(true);
        try {
            const data = await loadCertSkills(certification.id);
            setSkills(data || []);
        } catch (e) {
            console.error(e);
            setError(t('admin.certSkills.loadError') || 'Error loading skills');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSkill = async (skillData) => {
        const isUpdate = skillData.id;
        setSaving(skillData.id || 'create');
        try {
            const savedSkill = await saveCertSkill(certification.id, skillData);

            if (isUpdate) {
                setSkills(prev => prev.map(s => s.id === savedSkill.id ? savedSkill : s));
            } else {
                setSkills(prev => [...prev, savedSkill]);
            }

            if (onSkillsChange) onSkillsChange();
            setEditingSkill(null);
        } catch (e) {
            console.error(e);
            setError(t('admin.certSkills.saveError') || 'Error saving skill');
        } finally {
            setSaving(null);
        }
    };

    const handleDeleteSkill = async (skillId) => {
        if (!window.confirm(t('admin.certSkills.confirmDelete') || 'Delete this skill stack?')) return;

        try {
            await deleteCertSkill(certification.id, skillId);
            setSkills(prev => prev.filter(s => s.id !== skillId));
            if (onSkillsChange) onSkillsChange();
        } catch (e) {
            console.error(e);
            setError(t('admin.certSkills.deleteError') || 'Error deleting skill');
        }
    };

    const handleReorder = async (skillIdsInOrder) => {
        try {
            await reorderCertSkills(certification.id, skillIdsInOrder);
            const skillMap = new Map(skills.map(s => [s.id, s]));
            const reordered = skillIdsInOrder.map(id => skillMap.get(id)).filter(Boolean);
            setSkills(reordered);
        } catch (e) {
            console.error(e);
            setError(t('admin.certSkills.reorderError') || 'Error reordering skills');
            loadSkills();
        }
    };

    const moveSkill = (index, direction) => {
        const newSkills = [...skills];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newSkills.length) return;
        [newSkills[index], newSkills[newIndex]] = [newSkills[newIndex], newSkills[index]];
        setSkills(newSkills);
        handleReorder(newSkills.map(s => s.id));
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
                {t('admin.certSkills.loading') || 'Loading skills...'}
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

            {/* Skills List */}
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
                {skills.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Hash size={32} style={{ marginBottom: 16, color: 'var(--accent)', opacity: 0.5 }} />
                        <p style={{ marginBottom: 16, fontFamily: 'var(--font-mono)' }}>{t('admin.certSkills.noSkills')}</p>
                        <button onClick={() => setEditingSkill({})} className="cyber-btn" disabled={saving}>
                            <Plus size={16} style={{ marginRight: 8 }} />
                            {t('admin.certSkills.add')}
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: 600 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--card-bg)' }}>
                                    <th style={{ padding: '12px 16px', width: '50px' }}>{t('admin.certSkills.table.drag')}</th>
                                    <th style={{ padding: '12px 16px', width: '60px' }}>{t('admin.table.id')}</th>
                                    <th style={{ padding: '12px 16px' }}>{t('admin.certSkills.table.name')}</th>
                                    <th style={{ padding: '12px 16px', width: '120px' }}>{t('admin.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill, index) => (
                                    <tr key={skill.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => moveSkill(index, -1)}
                                                disabled={index === 0 || saving}
                                                className="icon-btn"
                                                aria-label={t('admin.certSkills.moveUp')}
                                            >
                                                <ArrowUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => moveSkill(index, 1)}
                                                disabled={index === skills.length - 1 || saving}
                                                className="icon-btn"
                                                aria-label={t('admin.certSkills.moveDown')}
                                            >
                                                <ArrowDown size={14} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {skill.id}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span className="cert-skill-tag" style={{ fontSize: '0.85rem' }}>
                                                {skill.name}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => setEditingSkill(skill)}
                                                    className="cyber-btn sec icon-btn"
                                                    title={t('admin.certSkills.edit')}
                                                    disabled={saving}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSkill(skill.id)}
                                                    className="cyber-btn sec icon-btn danger"
                                                    title={t('admin.certSkills.delete')}
                                                    disabled={saving}
                                                >
                                                    <Trash2 size={14} />
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

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
                <button onClick={() => setEditingSkill({})} className="cyber-btn" disabled={saving}>
                    <Plus size={16} style={{ marginRight: 8 }} />
                    {t('admin.certSkills.add')}
                </button>
            </div>

            {/* Skill Editor Modal */}
            {editingSkill !== null && (
                <CertificationSkillEditor
                    skill={editingSkill}
                    onSave={handleSaveSkill}
                    onCancel={() => setEditingSkill(null)}
                    isSaving={saving}
                />
            )}
        </div>
    );
}