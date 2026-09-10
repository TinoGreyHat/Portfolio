import { useState, useEffect } from 'react';
import { LogOut, FolderGit2, Award, Plus, Trash2 } from 'lucide-react';
import { logoutAdmin, loadProjects, loadCerts, deleteProject, deleteCert, saveProject, saveCert } from '../../services/apiService';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pData, cData] = await Promise.all([loadProjects(), loadCerts()]);
      setProjects(pData);
      setCerts(cData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  const handleDeleteProject = async (id) => {
    if(window.confirm('Supprimer ce projet ?')) {
      await deleteProject(id);
      fetchData();
    }
  };

  const handleDeleteCert = async (id) => {
    if(window.confirm('Supprimer cette certification ?')) {
      await deleteCert(id);
      fetchData();
    }
  };

  const handleAddProject = async () => {
    const title = prompt("Titre du projet:");
    if (!title) return;
    const desc = prompt("Description:");
    if (!desc) return;
    
    await saveProject({
        title,
        description: desc,
        status: 'COMPLETED',
        category: 'pentest',
        date: new Date().getFullYear().toString(),
        tags: []
    });
    fetchData();
  };

  const handleAddCert = async () => {
    const title = prompt("Titre de la certif:");
    if (!title) return;
    const issuer = prompt("Organisme:");
    if (!issuer) return;
    
    await saveCert({
        title,
        issuer,
        status: 'COMPLETED',
        date: new Date().getFullYear().toString(),
        skills: []
    });
    fetchData();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-light)', padding: 40 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>[TINOGREYHAT_SYSADMIN]</h1>
        <button onClick={handleLogout} className="cyber-btn sec">
          <LogOut size={16} style={{ marginRight: 8 }} />
          LOGOUT
        </button>
      </header>

      <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
        <button className={"cyber-btn " + (activeTab === 'projects' ? '' : 'sec')} onClick={() => setActiveTab('projects')}>
          <FolderGit2 size={16} style={{ marginRight: 8 }} />
          PROJETS
        </button>
        <button className={"cyber-btn " + (activeTab === 'certs' ? '' : 'sec')} onClick={() => setActiveTab('certs')}>
          <Award size={16} style={{ marginRight: 8 }} />
          CERTIFICATIONS
        </button>
      </div>

      <div>
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>Gestion des Projets</h2>
              <button onClick={handleAddProject} className="cyber-btn"><Plus size={16} style={{ marginRight: 8 }}/> Ajouter</button>
            </div>
            <div className="glass-panel" style={{ padding: 20 }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: 10 }}>ID</th>
                    <th style={{ padding: 10 }}>Titre</th>
                    <th style={{ padding: 10 }}>Catégorie</th>
                    <th style={{ padding: 10 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: 10, fontFamily: 'var(--font-mono)' }}>{p.id}</td>
                      <td style={{ padding: 10 }}>{p.title}</td>
                      <td style={{ padding: 10 }}>{p.category}</td>
                      <td style={{ padding: 10 }}>
                        <button onClick={() => handleDeleteProject(p.id)} style={{ background:'transparent', border:'none', color:'var(--red)', cursor:'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'certs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>Gestion des Certifications</h2>
              <button onClick={handleAddCert} className="cyber-btn"><Plus size={16} style={{ marginRight: 8 }}/> Ajouter</button>
            </div>
            <div className="glass-panel" style={{ padding: 20 }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: 10 }}>ID</th>
                    <th style={{ padding: 10 }}>Titre</th>
                    <th style={{ padding: 10 }}>Organisme</th>
                    <th style={{ padding: 10 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: 10, fontFamily: 'var(--font-mono)' }}>{c.id}</td>
                      <td style={{ padding: 10 }}>{c.title}</td>
                      <td style={{ padding: 10 }}>{c.issuer}</td>
                      <td style={{ padding: 10 }}>
                        <button onClick={() => handleDeleteCert(c.id)} style={{ background:'transparent', border:'none', color:'var(--red)', cursor:'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

