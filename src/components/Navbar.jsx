import { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'skills', label: 'Compétences' },
    { id: 'projects', label: 'Projets' },
    { id: 'certificates', label: 'Certificats' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' },
    { id: 'veille', label: 'Veille' }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`header-cyber ${scrolled ? 'scrolled' : ''}`}>
      <a href="#home" className="logo-cyber" onClick={() => handleNavClick('home')}>
        <Shield className="logo-icon-cyber" />
        <span className="logo-text-cyber">
          Tino<span className="logo-accent">GreyHat</span>
        </span>
      </a>

      {/* Desktop Navigation */}
      <nav className="nav-cyber">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link-cyber ${activeTab === item.id ? 'active' : ''}`}
                style={{ background: 'transparent', cursor: 'pointer' }}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Burger Menu Button */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            background: '#05070c',
            borderBottom: '1px solid var(--border-cyber-glow)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            gap: '15px',
            zIndex: 99
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link-cyber ${activeTab === item.id ? 'active' : ''}`}
              style={{ 
                background: 'transparent', 
                textAlign: 'left', 
                padding: '10px', 
                width: '100%',
                display: 'block'
              }}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
