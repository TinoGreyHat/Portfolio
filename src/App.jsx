import { useState } from 'react';
import NetworkBackground from './components/NetworkBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import About from './components/About';
import Veille from './components/Veille';
import { projectsData } from './data/projects';
import { certsData } from './data/certs';

// --- Helpers localStorage ---
const LS_PROJECTS_KEY = 'tinogreyhat_projects';
const LS_CERTS_KEY = 'tinogreyhat_certs';

const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn('localStorage read failed:', e);
  }
  return fallback;
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // --- Global State for Projects ---
  const [projects, setProjects] = useState(() =>
    loadFromStorage(LS_PROJECTS_KEY, projectsData)
  );

  // --- Global State for Certificates ---
  const [certs, setCerts] = useState(() =>
    loadFromStorage(LS_CERTS_KEY, certsData)
  );

  const addProject = (newProject) => {
    const withId = {
      ...newProject,
      id: Date.now(),
    };
    const updated = [...projects, withId];
    setProjects(updated);
    saveToStorage(LS_PROJECTS_KEY, updated);
  };

  const addCert = (newCert) => {
    const withId = {
      ...newCert,
      id: Date.now(),
    };
    const updated = [...certs, withId];
    setCerts(updated);
    saveToStorage(LS_CERTS_KEY, updated);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} projects={projects} certs={certs} />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects projects={projects} addProject={addProject} />;
      case 'certificates':
        return <Certificates certs={certs} addCert={addCert} />;
      case 'about':
        return <About />;
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
