import { useState } from 'react';
import { FolderGit2, X, Calendar, Shield, Activity, Search, Plus, Trash2 } from 'lucide-react';

// Inline SVG component to bypass missing brand icons in the registry's lucide-react version
const Github = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const CATEGORY_OPTIONS = [
  { value: 'pentest', label: 'Sécurité Offensive (Pentest)' },
  { value: 'defensive', label: 'Sécurité Défensive (Blue Team)' },
  { value: 'scripting', label: 'Scripting & Automatisation' },
  { value: 'reverse', label: 'Reverse Engineering' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  details: '',
  status: 'IN_PROGRESS',
  category: 'pentest',
  date: '',
  tags: '',
  githubLink: '',
};

function AddProjectModal({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Champ requis.';
    if (!form.description.trim()) e.description = 'Champ requis.';
    if (!form.date.trim()) e.date = 'Champ requis.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    onAdd({
      title: form.title.trim(),
      description: form.description.trim(),
      details: form.details.trim() || form.description.trim(),
      status: form.status,
      category: form.category,
      date: form.date.trim(),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      githubLink: form.githubLink.trim() || null,
    });
    onClose();
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: undefined })); },
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-cyber glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header-section">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan)', marginBottom: 8, letterSpacing: 1 }}>
            [ADD_PROJECT_RECORD]
          </div>
          <h3 className="modal-title" style={{ fontSize: '1.4rem' }}>
            <Plus size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Ajouter un Nouveau Projet
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Titre */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Titre du Projet <span style={{ color: 'var(--red)' }}>*</span></label>
            <input className="form-input-cyber" placeholder="ex: Détection d'Attaques SIEM avec Wazuh" {...field('title')} />
            {errors.title && <span style={{ color: 'var(--red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>⚠ {errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Description / Résumé <span style={{ color: 'var(--red)' }}>*</span></label>
            <textarea className="form-input-cyber" rows={3} placeholder="Résumé court du projet..." {...field('description')} />
            {errors.description && <span style={{ color: 'var(--red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>⚠ {errors.description}</span>}
          </div>

          {/* Détails techniques */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Détails Techniques (optionnel)</label>
            <textarea className="form-input-cyber" rows={4} placeholder="Description technique approfondie affichée dans la modale de détails..." {...field('details')} />
          </div>

          {/* Ligne Statut / Catégorie */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group-cyber">
              <label className="form-label-cyber">Statut</label>
              <select className="form-input-cyber" {...field('status')}>
                <option value="COMPLETED">[RESOLVED] — Terminé</option>
                <option value="IN_PROGRESS">[IN_PROGRESS] — En cours</option>
              </select>
            </div>
            <div className="form-group-cyber">
              <label className="form-label-cyber">Catégorie</label>
              <select className="form-input-cyber" {...field('category')}>
                {CATEGORY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Date / Période <span style={{ color: 'var(--red)' }}>*</span></label>
            <input className="form-input-cyber" placeholder="ex: Juillet 2025" {...field('date')} />
            {errors.date && <span style={{ color: 'var(--red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>⚠ {errors.date}</span>}
          </div>

          {/* Technologies / Tags */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Technologies / Tags (séparés par des virgules)</label>
            <input className="form-input-cyber" placeholder="ex: SIEM, Wazuh, SOC, Python" {...field('tags')} />
          </div>

          {/* GitHub */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Lien GitHub / Repository (optionnel)</label>
            <input className="form-input-cyber" type="url" placeholder="https://github.com/TinoGreyHat/..." {...field('githubLink')} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18, marginTop: 4 }}>
            <button type="button" className="cyber-btn sec" onClick={onClose}>
              <X size={14} /> Annuler
            </button>
            <button type="submit" className="cyber-btn">
              <Plus size={14} /> Ajouter le Projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects({ projects, addProject, deleteProject }) {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'pentest', label: 'Sécurité Offensive' },
    { id: 'defensive', label: 'Sécurité Défensive' },
    { id: 'scripting', label: 'Scripting & Autom.' },
    { id: 'reverse', label: 'Reverse Eng.' }
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  const handleDelete = (e, project) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer le projet "${project.title}" ?`)) {
      if (deleteProject) deleteProject(project.id);
      if (selectedProject?.id === project.id) setSelectedProject(null);
    }
  };

  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title">
            <FolderGit2 className="title-icon" size={28} />
            Mes Travaux & Projets
            <div className="title-line"></div>
          </h2>
          {/* ADD BUTTON */}
          <button
            className="cyber-btn"
            onClick={() => setShowAddModal(true)}
            title="Ajouter un nouveau projet"
            style={{ flexShrink: 0, padding: '9px 18px', fontSize: '0.82rem' }}
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
        <p className="section-desc">
          Une sélection de projets techniques réalisés en laboratoire, simulant des attaques,
          des audits de sécurité, du reverse engineering et le déploiement d'architectures SOC.
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontSize: '0.8rem', marginLeft: 8 }}>
            [{projects.length} projet{projects.length !== 1 ? 's' : ''}]
          </span>
        </p>
      </div>

      {/* Filters bar */}
      <div className="filters-bar">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <p style={{ marginBottom: 8 }}>Aucun projet dans cette catégorie.</p>
          <button className="cyber-btn sec" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Ajouter votre premier projet
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card glass-panel">
              <div className="project-card-header">
                <span className={`project-badge-status ${project.status === 'COMPLETED' ? 'completed' : 'in-progress'}`}>
                  {project.status === 'COMPLETED' ? '[RESOLVED]' : '[IN_PROGRESS]'}
                </span>
                <span className="project-date">{project.date}</span>
              </div>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>

              <div className="project-tags">
                {(project.tags || []).map((tag, idx) => (
                  <span key={idx} className="project-tag">{tag}</span>
                ))}
              </div>

              <div className="project-links">
                <button
                  className="project-link-btn"
                  onClick={() => setSelectedProject(project)}
                >
                  <Search size={14} />
                  Détails
                </button>
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link-btn"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                )}
                {deleteProject && (
                  <button
                    className="project-link-btn"
                    onClick={(e) => handleDelete(e, project)}
                    title="Supprimer ce projet"
                    style={{ color: 'var(--red)', borderColor: 'rgba(255,62,108,0.2)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Writeup Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div
            className="modal-content-cyber glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setSelectedProject(null)}
              aria-label="Fermer la modale"
            >
              <X size={20} />
            </button>

            <div className="modal-header-section">
              <div className="modal-meta-row">
                <span className={`project-badge-status ${selectedProject.status === 'COMPLETED' ? 'completed' : 'in-progress'}`}>
                  {selectedProject.status === 'COMPLETED' ? 'STATUS: RESOLVED' : 'STATUS: IN_PROGRESS'}
                </span>
                <span className="project-date" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  {selectedProject.date}
                </span>
              </div>
              <h3 className="modal-title">{selectedProject.title}</h3>
            </div>

            <div className="modal-body-section">
              <div>
                <h4 className="modal-sub-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} />
                  Description Générale
                </h4>
                <p>{selectedProject.description}</p>
              </div>

              {selectedProject.details && (
                <div>
                  <h4 className="modal-sub-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} />
                    Détails de l'Implémentation
                  </h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{selectedProject.details}</p>
                </div>
              )}

              <div>
                <h4 className="modal-sub-title">Technologies Appliquées</h4>
                <div className="project-tags" style={{ marginTop: '10px' }}>
                  {(selectedProject.tags || []).map((tag, idx) => (
                    <span key={idx} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer-section">
              {selectedProject.githubLink && (
                <a
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="cyber-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <Github size={14} />
                  Consulter le Code Source
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          onAdd={addProject}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </section>
  );
}
