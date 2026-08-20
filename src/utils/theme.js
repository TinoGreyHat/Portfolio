export const THEMES = {
  green: {
    name: 'Cyber Green (Default)',
    accent: '#00e89b',
    accentHover: '#00c583',
    accentGlow: 'rgba(0, 232, 155, 0.35)',
    borderGlow: 'rgba(0, 232, 155, 0.4)',
    cyan: '#00d2ff',
    cyanGlow: 'rgba(0, 210, 255, 0.35)',
  },
  cyan: {
    name: 'Neon Cyan (Blue Team)',
    accent: '#00d2ff',
    accentHover: '#0099ff',
    accentGlow: 'rgba(0, 210, 255, 0.35)',
    borderGlow: 'rgba(0, 210, 255, 0.4)',
    cyan: '#00e89b',
    cyanGlow: 'rgba(0, 232, 155, 0.35)',
  },
  red: {
    name: 'Red Team Ops (Alert)',
    accent: '#ff3e6c',
    accentHover: '#e02855',
    accentGlow: 'rgba(255, 62, 108, 0.35)',
    borderGlow: 'rgba(255, 62, 108, 0.4)',
    cyan: '#f8f32b',
    cyanGlow: 'rgba(248, 243, 43, 0.35)',
  },
  purple: {
    name: 'Cyberpunk Synthwave',
    accent: '#b829ea',
    accentHover: '#981fd1',
    accentGlow: 'rgba(184, 41, 234, 0.35)',
    borderGlow: 'rgba(184, 41, 234, 0.4)',
    cyan: '#00d2ff',
    cyanGlow: 'rgba(0, 210, 255, 0.35)',
  },
  amber: {
    name: 'Retro Terminal Amber',
    accent: '#ffb000',
    accentHover: '#e09800',
    accentGlow: 'rgba(255, 176, 0, 0.35)',
    borderGlow: 'rgba(255, 176, 0, 0.4)',
    cyan: '#ff5500',
    cyanGlow: 'rgba(255, 85, 0, 0.35)',
  }
};

const LS_THEME_KEY = 'tinogreyhat_theme';

export const applyTheme = (themeKey) => {
  const theme = THEMES[themeKey];
  if (!theme) return false;

  const root = document.documentElement;
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-hover', theme.accentHover);
  root.style.setProperty('--accent-glow', theme.accentGlow);
  root.style.setProperty('--border-cyber-glow', theme.borderGlow);
  root.style.setProperty('--cyan', theme.cyan);
  root.style.setProperty('--cyan-glow', theme.cyanGlow);

  try {
    localStorage.setItem(LS_THEME_KEY, themeKey);
  } catch { /* ignore */ }

  return true;
};

export const initTheme = () => {
  try {
    const saved = localStorage.getItem(LS_THEME_KEY);
    if (saved && THEMES[saved]) {
      applyTheme(saved);
    }
  } catch { /* ignore */ }
};
