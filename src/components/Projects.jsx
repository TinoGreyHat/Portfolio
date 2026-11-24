import { useState, useEffect, useMemo } from 'react';
import { FolderGit2, X, Calendar, Shield, Activity, Search, ArrowLeft, Terminal, FileText, List, Hash, Layers } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import { loadProjects } from '../services/apiService';
import DOMPurify from 'dompurify';

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

// Section Content Renderer
function SectionRenderer({ section }) {
  const { contentType, content, title, icon } = section;

  const renderContent = () => {
    switch (contentType) {
      case 'paragraph':
        return (
          <div className="section-content-paragraph">
            {content.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '1rem', lineHeight: 1.7 }}>{para}</p>
            ))}
          </div>
        );

      case 'bulletList':
        return (
          <ul className="section-content-bulletlist" style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            {content.split('\n').filter(line => line.trim()).map((line, i) => (
              <li key={i} style={{ position: 'relative', paddingLeft: '0.5rem' }}>
                <span style={{ position: 'absolute', left: '-1rem', color: 'var(--accent)' }}>▸</span>
                {line.replace(/^[-•]\s*/, '')}
              </li>
            ))}
          </ul>
        );

      case 'numberedList':
        return (
          <ol className="section-content-numberedlist" style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            {content.split('\n').filter(line => line.trim()).map((line, i) => (
              <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        );

      case 'techList':
        return (
          <div className="section-content-techlist" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {content.split('\n').filter(line => line.trim()).map((tech, i) => (
              <span key={i} className="project-tag" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                {tech.trim()}
              </span>
            ))}
          </div>
        );

      case 'mixed':
      default:
        // Simple Markdown rendering for mixed content
        const sanitized = DOMPurify.sanitize(content
          .replace(/^### (.*$)/gim, '<h4 style="margin:1.5rem 0 0.5rem;color:var(--cyan)">$1</h4>')
          .replace(/^## (.*$)/gim, '<h3 style="margin:1.5rem 0 0.5rem;color:var(--cyan)">$1</h3>')
          .replace(/^# (.*$)/gim, '<h2 style="margin:1.5rem 0 0.5rem;color:var(--cyan)">$1</h2>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code style="background:var(--card-bg);padding:0.1rem 0.3rem;border-radius:3px;font-family:var(--font-mono)">$1</code>')
          .replace(/\n```(\w*)\n([\s\S]*?)\n```/g, '<pre style="background:var(--bg-cyber);padding:1rem;border-radius:6px;overflow-x:auto;margin:1rem 0"><code class="language-$1" style="font-family:var(--font-mono);font-size:0.85rem;line-height:1.6">$2</code></pre>')
          .replace(/\n- (.*$)/gim, '<li>$1</li>')
          .replace(/(<li>.*<\/li>)/s, '<ul style="padding-left:1.5rem;line-height:1.8">$1</ul>')
          .replace(/\n\d+\. (.*$)/gim, '<li>$1</li>')
          .replace(/\n\n/g, '</p><p style="margin:1rem 0;line-height:1.7">')
          .replace(/^(.*$)/, '<p style="margin:1rem 0;line-height:1.7">$1')
          .replace(/(.*)$/, '$1</p>')
        );
        return <div className="section-content-mixed" dangerouslySetInnerHTML={{ __html: sanitized }} />;
    }
  };

  const ContentIcon = () => {
    switch (contentType) {
      case 'paragraph': return <FileText size={16} />;
      case 'bulletList': return <List size={16} />;
      case 'numberedList': return <Hash size={16} />;
      case 'techList': return <Layers size={16} />;
      case 'mixed': return <Terminal size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="project-section" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        {icon && <span style={{ fontSize: '1.5rem' }}>{icon}</span>}
        <h4 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--cyan)',
          margin: 0,
          fontSize: '1.1rem'
        }}>
          <ContentIcon style={{ color: 'var(--accent)' }} />
          {title}
        </h4>
      </div>
      <div style={{ color: 'var(--text-main)', lineHeight: 1.7 }}>
        {renderContent()}
      </div>
    </div>
  );
}

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
            style={{ maxHeight: '90vh', overflow: 'auto' }}
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

            <div className="modal-body-section" style={{ padding: '0 1rem 1rem' }}>
              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 className="modal-sub-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <Shield size={16} />
                  {t('projects.modalDescription')}
                </h4>
                <p style={{ lineHeight: 1.7 }}>{selectedProject.description}</p>
              </div>

              {/* Dynamic Sections */}
              {(selectedProject.sections && selectedProject.sections.length > 0) && (
                <div>
                  <h4 className="modal-sub-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Activity size={16} />
                    {t('projects.modalDetails')}
                  </h4>
                  {selectedProject.sections
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((section) => (
                      <SectionRenderer key={section.id} section={section} />
                    ))}
                </div>
              )}

              {/* Fallback to legacy details field if no sections */}
              {(!selectedProject.sections || selectedProject.sections.length === 0) && selectedProject.details && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 className="modal-sub-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Activity size={16} />
                    {t('projects.modalDetails')}
                  </h4>
                  <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>{selectedProject.details}</p>
                </div>
              )}

              {/* Technologies */}
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
                  <GithubIcon size={14} />
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