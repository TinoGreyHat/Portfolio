import { useState, useEffect } from 'react';
import { FolderGit2, X, Calendar, Shield, Activity, Search, ArrowLeft } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import { loadProjects } from '../services/apiService';

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

// Read-only Projects Component

export default function Projects() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await loadProjects();
        setProjects(data || []);
      } catch (err) {
        console.error("Erreur de chargement des projets:", err.message);
        setError(err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const categories = [
    { id: 'all', label: t('projects.filterAll') },
    { id: 'pentest', label: t('projects.filterPentest') },
    { id: 'defensive', label: t('projects.filterDefensive') },
    { id: 'scripting', label: t('projects.filterScripting') },
    { id: 'reverse', label: t('projects.filterReverse') }
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);


  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <button className="page-back-btn" onClick={handleBack} aria-label={t('common.back')}>
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title">
            <FolderGit2 className="title-icon" size={28} />
            {t('projects.sectionTitle')}
            <div className="title-line"></div>
          </h2>
        </div>
        <p className="section-desc">
          {t('projects.sectionDesc')}
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontSize: '0.8rem', marginLeft: 8 }}>
            {t('projects.projectCount', { count: projects.length })}
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
          <p style={{ marginBottom: 8 }}>{t('projects.noProjects')}</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card glass-panel">
              <div className="project-card-header">
                <span className={`project-badge-status ${project.status === 'COMPLETED' ? 'completed' : 'in-progress'}`}>
                  {project.status === 'COMPLETED' ? t('projects.badgeCompleted') : t('projects.badgeInProgress')}
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
                  {t('projects.details')}
                </button>
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link-btn"
                  >
                    <Github size={14} />
                    {t('projects.github')}
                  </a>
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
              aria-label={t('common.close')}
            >
              <X size={20} />
            </button>

            <div className="modal-header-section">
              <div className="modal-meta-row">
                <span className={`project-badge-status ${selectedProject.status === 'COMPLETED' ? 'completed' : 'in-progress'}`}>
                  {selectedProject.status === 'COMPLETED' ? t('projects.modalStatusCompleted') : t('projects.modalStatusInProgress')}
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
                  {t('projects.modalDescription')}
                </h4>
                <p>{selectedProject.description}</p>
              </div>

              {selectedProject.details && (
                <div>
                  <h4 className="modal-sub-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} />
                    {t('projects.modalDetails')}
                  </h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{selectedProject.details}</p>
                </div>
              )}

              <div>
                <h4 className="modal-sub-title">{t('projects.modalTechnologies')}</h4>
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
                  {t('projects.modalViewSource')}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}