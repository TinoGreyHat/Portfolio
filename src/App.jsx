import { useState, useEffect } from 'react';
import NetworkBackground from './components/NetworkBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
  const [activeTab, setActiveTab] = useState('home');
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    initTheme();

    // Async load from Cloud DB / LocalStorage Hybrid
    async function initData() {
      try {
        const p = await loadProjects();
        const c = await loadCerts();
        setProjects(p || []);
        setCerts(c || []);
      } catch (err) {
        console.error("Erreur de chargement des données depuis l'API:", err.message);
        // Fallback or empty state
        setProjects([]);
        setCerts([]);
      }
    }
    initData();
  }, []);

  // Functions like addProject, removeProject are moved to Admin dashboard

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} projects={projects} certs={certs} />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects projects={projects} />;
      case 'certificates':
        return <Certificates certs={certs} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'veille':
        return <Veille />;
      default:
        return <Home setActiveTab={setActiveTab} projects={projects} certs={certs} />;
    }
  };

  return (
    <>
      <NetworkBackground />
      <div className="cyber-grid" />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-container">
        {renderActiveComponent()}
      </main>
      <Footer />
    </>
  );
}

export default App;
