import { useState, useEffect } from 'react';
import { Mail, FileText, Award, Briefcase, Code2, ShieldAlert } from 'lucide-react';
import Terminal from './Terminal';

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


export default function Home({ setActiveTab, projects, certs }) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const titles = [
    "Étudiant en Cybersécurité",
    "Passionné par le Hacking Éthique",
    "Apprenti Pentester / Analyste SOC",
    "Développeur d'outils de sécurité"
  ];

  useEffect(() => {
    let handle = setTimeout(() => {
      const i = loopNum % titles.length;
      const fullTitle = titles[i];

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
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <div className="app-container" style={{ paddingTop: 0 }}>
      {/* Hero section */}
      <section className="hero-section">
        {/* Left Column - Profile Card */}
        <div className="profile-card glass-panel">
          <div className="avatar-container">
            <img 
              src="./assets/img/etiam.jpg" 
              alt="Photo de TETE Kokou Blaise Etiam" 
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=TinoGreyHat';
              }}
            />
            <span className="avatar-badge">LVL.3</span>
          </div>

          <h1 className="profile-name">TETE Kokou Blaise Etiam</h1>
          <p className="profile-alias">alias TinoGreyHat</p>
          
          <div className="typewriter-text">
            <span>&gt; {text}</span>
          </div>

          <p className="profile-bio">
            Étudiant passionné par l'exploration des vulnérabilités, l'administration de systèmes sécurisés 
            et la supervision SIEM. Je conçois des scripts d'audit et m'entraîne quotidiennement en CTF 
            pour forger mes compétences défensives et offensives.
          </p>

          <div className="cyber-badges">
            <span className="badge-item success">[SYSTEM: SECURE]</span>
            <span className="badge-item">[ROLE: BLUE/RED]</span>
            <span className="badge-item">[PENTEST: LABS]</span>
          </div>

          <div className="btn-container">
            <a 
              href="./assets/pdf/CV TINOGEYHAT .pdf" 
              className="cyber-btn" 
              target="_blank" 
              rel="noreferrer"
            >
              <FileText size={16} />
              Télécharger mon CV
            </a>
            <button 
              className="cyber-btn sec"
              onClick={() => setActiveTab('contact')}
            >
              <Mail size={16} />
              Me contacter
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
              aria-label="GitHub Profile"
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
              aria-label="LinkedIn Profile"
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
              aria-label="TryHackMe Profile"
            >
              <ShieldAlert size={22} />
            </a>
          </div>
        </div>

        {/* Right Column - Terminal */}
        <Terminal projects={projects} certs={certs} />
      </section>

      {/* Stats row */}
      <section className="stats-container">
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="stat-number">Top 4%</div>
            <div className="stat-label">TryHackMe Rank</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-number">4+</div>
            <div className="stat-label">Projets Cyber</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <Award size={24} />
          </div>
          <div>
            <div className="stat-number">3+</div>
            <div className="stat-label">Certifications</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <Code2 size={24} />
          </div>
          <div>
            <div className="stat-number">Python/Bash</div>
            <div className="stat-label">Langages Favoris</div>
          </div>
        </div>
      </section>
    </div>
  );
}
