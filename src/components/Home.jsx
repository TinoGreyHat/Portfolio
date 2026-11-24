import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, FileText, Award, Briefcase, Code2, ShieldAlert } from 'lucide-react';
import Terminal from './Terminal';
import { useI18n } from '../contexts/I18nContext';
import { loadProjects, loadCerts } from '../services/apiService';

// Inline SVG components to bypass missing brand icons in the registry's lucide-react version
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

const Linkedin = (props) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


export default function Home() {
  const { t, isReady } = useI18n();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const statsRef = useRef(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [p, c] = await Promise.all([loadProjects(), loadCerts()]);
        setProjects(p || []);
        setCerts(c || []);
      } catch (err) {
        console.error("Erreur de chargement des données:", err.message);
        setError(err.message);
        setProjects([]);
        setCerts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get translated titles with fallback for when translations aren't ready yet
  const TITLES = useMemo(() => (isReady ? t('home.titles') : []), [isReady, t]);
  // Get translated badges with fallback for when translations aren't ready yet
  const BADGES = useMemo(() => (isReady ? t('home.badges') : []), [isReady, t]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let pCount = 0;
        let cCount = 0;
        const interval = setInterval(() => {
          let updated = false;
          if (pCount < 4) {
            pCount++;
            setProjectsCount(pCount);
            updated = true;
          }
          if (cCount < 3) {
            cCount++;
            setCertsCount(cCount);
            updated = true;
          }
          if (!updated) {
            clearInterval(interval);
          }
        }, 300);
      }
    }, { threshold: 0.2 });

    const statsEl = statsRef.current;
    if (statsEl) {
      observer.observe(statsEl);
    }

    return () => {
      if (statsEl) {
        observer.unobserve(statsEl);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    // Guard: don't run typing effect if TITLES is empty (translations not ready)
    if (TITLES.length === 0) return;

    let handle = setTimeout(() => {
      const i = loopNum % TITLES.length;
      const fullTitle = TITLES[i];

      if (isDeleting) {
        setText(fullTitle.substring(0, text.length - 1));
        setTypingSpeed(50);
      } else {
        setText(fullTitle.substring(0, text.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && text === fullTitle) {
        setIsDeleting(true);
        setTypingSpeed(1500); // Wait before starting to delete
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Wait before starting next word
      }
    }, typingSpeed);

    return () => clearTimeout(handle);
  }, [text, isDeleting, loopNum, typingSpeed, TITLES]);

  return (
    <div className="app-container" style={{ paddingTop: 0 }}>
      {/* Hero section */}
      <section className="hero-section">
        {/* Left Column - Profile Card */}
        <div className="profile-card glass-panel">
          <div className="avatar-container">
            <img
              src="./assets/img/etiam.jpg"
              alt={t('home.profileName')}
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=TinoGreyHat';
              }}
            />
            <span className="avatar-badge">LVL.3</span>
          </div>

          <h1 className="profile-name">{t('home.profileName')}</h1>
          <p className="profile-alias">alias {t('home.profileAlias')}</p>

          <div className="typewriter-text">
            <span>{'>'} {text}</span>
          </div>

          <p className="profile-bio">
            {t('home.bio')}
          </p>

          <div className="cyber-badges">
            {BADGES.map((badge, index) => (
              <span key={index} className={`badge-item ${index === 0 ? 'success' : ''}`}>
                {badge}
              </span>
            ))}
          </div>

          <div className="btn-container">
            <a
              href="./assets/pdf/CV TINOGEYHAT .pdf"
              className="cyber-btn"
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={16} />
              {t('home.cta.downloadCV')}
            </a>
            <button
              className="cyber-btn sec"
              onClick={() => navigate('/about')}
            >
              <Mail size={16} />
              {t('home.cta.contactMe')}
            </button>
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '24px' }}>
            <a
              href="https://github.com/TinoGreyHat"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              aria-label={t('home.social.github')}
            >
              <Github size={22} />
            </a>
            <a
              href="https://linkedin.com/in/tinogreyhat"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              aria-label={t('home.social.linkedin')}
            >
              <Linkedin size={22} />
            </a>
            <a
              href="https://tryhackme.com/p/TinoGreyHat"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              aria-label={t('home.social.tryhackme')}
            >
              <ShieldAlert size={22} />
            </a>
          </div>
        </div>

        {/* Right Column - Terminal */}
        <Terminal projects={projects} certs={certs} />
      </section>

      {/* Stats row */}
      <section className="stats-container" ref={statsRef}>
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="stat-number">Top 4%</div>
            <div className="stat-label">{t('home.stats.tryhackme')}</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-number">+{projectsCount}</div>
            <div className="stat-label">{t('home.stats.cyberProjects')}</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <Award size={24} />
          </div>
          <div>
            <div className="stat-number">+{certsCount}</div>
            <div className="stat-label">{t('home.stats.certificationsShort')}</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <Code2 size={24} />
          </div>
          <div>
            <div className="stat-number">Python/Bash</div>
            <div className="stat-label">{t('home.stats.languages')}</div>
          </div>
        </div>
      </section>
    </div>
  );
}