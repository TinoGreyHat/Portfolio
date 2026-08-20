import { useState, useEffect } from 'react';
import NetworkBackground from './components/NetworkBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import About from './components/About';
import Veille from './components/Veille';
import { initTheme } from './utils/theme';
import { loadProjects, saveProject, deleteProject, loadCerts, saveCert, deleteCert } from './services/cloudDb';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    initTheme();

    // Async load from Cloud DB / LocalStorage Hybrid
    async function initData() {
      const p = await loadProjects();
      const c = await loadCerts();
      setProjects(p);
      setCerts(c);
    }
    initData();
  }, []);

  const addProject = async (newProject) => {
    const updated = await saveProject(newProject);
    setProjects(updated);
  };

  const removeProject = async (id) => {
    const updated = await deleteProject(id);
    setProjects(updated);
  };

  const addCert = async (newCert) => {
    const updated = await saveCert(newCert);
    setCerts(updated);
  };

  const removeCert = async (id) => {
    const updated = await deleteCert(id);
    setCerts(updated);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} projects={projects} certs={certs} />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects projects={projects} addProject={addProject} deleteProject={removeProject} />;
      case 'certificates':
        return <Certificates certs={certs} addCert={addCert} deleteCert={removeCert} />;
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
