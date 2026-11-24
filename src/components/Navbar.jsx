import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, MapPin, Sun, Moon, ChevronRight } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';

// Static nav items - defined outside component to avoid recreation
const NAV_ITEMS = [
  { id: 'home', labelKey: 'nav.home', path: '/' },
  { id: 'roadmap', labelKey: 'nav.roadmap', icon: MapPin, path: '/roadmap' },
  { id: 'skills', labelKey: 'nav.skills', path: '/skills' },
  { id: 'projects', labelKey: 'nav.projects', path: '/projects' },
  { id: 'certificates', labelKey: 'nav.certificates', path: '/certificates' },
  { id: 'about', labelKey: 'nav.about', path: '/about' },
  { id: 'experiences', labelKey: 'nav.experiences', path: '/about#experiences' },
  { id: 'formation', labelKey: 'nav.formation', path: '/about#formation' },
  { id: 'contact', labelKey: 'nav.contact', path: '/contact' },
  { id: 'veille', labelKey: 'nav.veille', path: '/veille' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();
  const { resolvedMode, setMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

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

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        if (hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
          setMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const getActiveTab = useCallback(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/roadmap')) return 'roadmap';
    if (pathname === '/') return 'home';
    const matched = NAV_ITEMS.find(item => pathname === item.path);
    return matched?.id || 'home';
  }, [location.pathname]);

  const activeTab = getActiveTab();

  const handleNavClick = useCallback((item) => {
    if (item.path === '/') {
      navigate('/', { replace: true });
    } else {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleLangChange = useCallback((newLang) => {
    setLang(newLang);
  }, [setLang]);

  const handleThemeToggle = useCallback(() => {
    // Toggle between dark and light only (not system)
    const newMode = resolvedMode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  }, [resolvedMode, setMode]);

  // Show navbar immediately - theme will apply when ready
  // Don't hide with opacity: 0 as it makes navbar invisible if theme context has issues

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <nav
          ref={mobileMenuRef}
          className="mobile-menu-panel"
          role="navigation"
          aria-label={t('nav.home')}
        >
          <div className="mobile-menu-header">
            <div className="logo-cyber">
              <Shield className="logo-icon-cyber" />
              <span className="logo-text-cyber">Tino<span className="logo-accent">GreyHat</span></span>
            </div>
            <button
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label={t('common.close')}
            >
              <X size={24} />
            </button>
          </div>

          <div className="mobile-menu-nav">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item)}
                  >
                    {item.icon && <item.icon size={16} />}
                    <span>{t(item.labelKey)}</span>
                    {activeTab === item.id && <ChevronRight size={16} className="active-indicator" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mobile-menu-divider" />

          <div className="mobile-menu-settings">
            {/* Language Selector */}
            <div className="mobile-setting-item">
              <label className="mobile-setting-label">{t('common.language')}</label>
              <div className="language-selector-mobile">
                <button
                  className={`lang-btn ${lang === 'fr' ? 'active' : ''}`}
                  onClick={() => handleLangChange('fr')}
                  aria-pressed={lang === 'fr'}
                >
                  FR
                </button>
                <button
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => handleLangChange('en')}
                  aria-pressed={lang === 'en'}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Theme Toggle Mobile */}
            <div className="mobile-setting-item">
              <label className="mobile-setting-label">{t('common.theme')}</label>
              <button
                className="theme-toggle-btn-mobile"
                onClick={handleThemeToggle}
                aria-label={resolvedMode === 'dark' ? t('common.lightMode') : t('common.darkMode')}
                aria-pressed={resolvedMode === 'dark'}
              >
                <span className="theme-toggle-icon-mobile">
                  {resolvedMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </span>
                <span className="theme-toggle-text-mobile">
                  {resolvedMode === 'dark' ? t('common.lightMode') : t('common.darkMode')}
                </span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Header */}
      <header className={`header-cyber ${scrolled ? 'scrolled' : ''}`}>
        <a href="/" className="logo-cyber" onClick={(e) => { e.preventDefault(); handleNavClick({ path: '/' }); }}>
          <Shield className="logo-icon-cyber" />
          <span className="logo-text-cyber">
            Tino<span className="logo-accent">GreyHat</span>
          </span>
        </a>

        {/* Desktop Controls: Language + Theme Toggle */}
        <div className="header-controls" aria-label="Contrôles d'interface">
          {/* Language Selector */}
          <div className="language-selector" role="group" aria-label={t('common.language')}>
            <button
              className={`lang-btn ${lang === 'fr' ? 'active' : ''}`}
              onClick={() => handleLangChange('fr')}
              aria-pressed={lang === 'fr'}
              title="Français"
            >
              FR
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => handleLangChange('en')}
              aria-pressed={lang === 'en'}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Theme Toggle - Single button */}
          <button
            className="theme-toggle-btn-single"
            onClick={handleThemeToggle}
            aria-label={resolvedMode === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            aria-pressed={resolvedMode === 'dark'}
            title={resolvedMode === 'dark' ? t('common.lightMode') : t('common.darkMode')}
          >
            {resolvedMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Hamburger Button - Always visible */}
        <button
          ref={hamburgerRef}
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t('common.close') : 'Ouvrir le menu de navigation'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu-panel"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
    </>
  );
}