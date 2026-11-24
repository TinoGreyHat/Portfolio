import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './components/Home';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import About from './components/About';
import Contact from './components/Contact';
import Veille from './components/Veille';
import { initTheme } from './utils/theme';
import { loadProjects, loadCerts } from './services/apiService';

function App() {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    initTheme();

    async function initData() {
      try {
        const p = await loadProjects();
        const c = await loadCerts();
        setProjects(p || []);
        setCerts(c || []);
      } catch (err) {
        console.error("Erreur de chargement des données depuis l'API:", err.message);
        setProjects([]);
        setCerts([]);
      }
    }
    initData();
  }, []);

  // Determine which component to render based on route
  const getActiveComponent = () => {
    const pathname = location.pathname;
    switch (pathname) {
      case '/skills':
        return <Skills />;
      case '/projects':
        return <Projects projects={projects} />;
      case '/certificates':
        return <Certificates certs={certs} />;
      case '/about':
        return <About />;
      case '/contact':
        return <Contact />;
      case '/veille':
        return <Veille />;
      case '/':
      default:
        return <Home projects={projects} certs={certs} />;
    }
  };

  return <>{getActiveComponent()}</>;
}

export default App;
