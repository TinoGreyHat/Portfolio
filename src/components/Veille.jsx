import { useState, useEffect, useRef } from 'react';
import { Activity, Globe, ExternalLink, Search, ShieldAlert, RefreshCw } from 'lucide-react';
import { sourcesVeille, simulatedAlerts } from '../data/veille';
import { fetchLiveCISAAlerts, getNvdUrl } from '../services/cveApi';

export default function Veille() {
  const [activeTab, setActiveTab] = useState('cisa'); // 'cisa' or 'sources'
  const [searchTerm, setSearchTerm] = useState('');
  const [cisaAlerts, setCisaAlerts] = useState([]);
  const [isLoadingCisa, setIsLoadingCisa] = useState(true);
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  // Load live CISA alerts
  const loadCisaData = async () => {
    setIsLoadingCisa(true);
    const alerts = await fetchLiveCISAAlerts();
    setCisaAlerts(alerts);
    setIsLoadingCisa(false);
  };

  useEffect(() => {
    loadCisaData();
  }, []);

  // Initialize SOC logs
  useEffect(() => {
    const shuffled = [...simulatedAlerts].sort(() => 0.5 - Math.random());
    const initial = shuffled.slice(0, 6).map((item, idx) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - (6 - idx) * 3);
      const timeStr = d.toTimeString().split(' ')[0];
      return { ...item, time: timeStr };
    });
    setLogs(initial);
  }, []);

  // Real-time threat ingestion feed (combining live CISA + simulated alerts)
  useEffect(() => {
    const interval = setInterval(() => {
      let newLog;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      if (cisaAlerts.length > 0 && Math.random() > 0.4) {
        const randomCisa = cisaAlerts[Math.floor(Math.random() * cisaAlerts.length)];
        newLog = {
          time: timeStr,
          type: 'LIVE_CISA_KEV',
          severity: randomCisa.severity === 'CRITICAL' ? 'critical' : 'warning',
          content: `[${randomCisa.cveID}] ${randomCisa.vendorProject} ${randomCisa.product} - ${randomCisa.vulnerabilityName.slice(0, 75)}...`
        };
      } else {
        const randomSim = simulatedAlerts[Math.floor(Math.random() * simulatedAlerts.length)];
        newLog = { ...randomSim, time: timeStr };
      }

      setLogs(prevLogs => {
        const updated = [...prevLogs, newLog];
        if (updated.length > 15) {
          return updated.slice(updated.length - 15);
        }
        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [cisaAlerts]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Filters
  const filteredSources = sourcesVeille.filter(source =>
    source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCisa = cisaAlerts.filter(item =>
    item.cveID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendorProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <h2 className="section-title">
          <Activity className="title-icon" size={28} />
          Veille Technologique & Cyber-Renseignement
          <div className="title-line"></div>
        </h2>
        <p className="section-desc">
          Supervision en direct des vulnérabilités exploitées dans le monde (Flux officiel CISA KEV & NIST NVD), 
          analyses d'incidents et curation des meilleures sources cyber.
        </p>
      </div>

      <div className="veille-layout">
        {/* Left column - Live threat feed / SOC simulator */}
        <div>
          <div className="soc-monitor">
            <div className="soc-header">
              <div className="soc-status-indicator">
                <span className="status-dot-blink"></span>
                <span>CYBER_THREAT_INTEL_MONITOR (LIVE_CISA_FEED)</span>
              </div>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                RATE: ~0.3 EPS
              </span>
            </div>

            <div className="soc-body">
              <div style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(0,232,155,0.1)', paddingBottom: '8px', marginBottom: '8px' }}>
                [+] Live Ingestion Active. Interrogation du flux CISA KEV (Known Exploited Vulnerabilities)...
              </div>

              {logs.map((log, idx) => (
                <div key={idx} className={`log-entry ${log.severity}`}>
                  <span className="log-time">[{log.time}]</span>
                  <span className={`log-type ${log.severity}`}>[{log.type}]</span>
                  <span className="log-content">{log.content}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Right column - CISA & Curation sources */}
        <div className="veille-sources-section">
          {/* Sub-tabs header */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <button
              className={`cyber-btn ${activeTab === 'cisa' ? '' : 'sec'}`}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('cisa')}
            >
              <ShieldAlert size={14} />
              CISA KEV Live ({cisaAlerts.length})
            </button>
            <button
              className={`cyber-btn ${activeTab === 'sources' ? '' : 'sec'}`}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('sources')}
            >
              <Globe size={14} />
              Sources & Feeds ({sourcesVeille.length})
            </button>
          </div>

          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.15)',
              border: '1px solid var(--border-cyber)',
              borderRadius: '4px',
              padding: '6px 12px',
              gap: '10px',
              marginBottom: '16px'
            }}
          >
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={activeTab === 'cisa' ? "Filtrer par CVE, éditeur, produit..." : "Filtrer les sources..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                width: '100%'
              }}
            />
            {activeTab === 'cisa' && (
              <button
                onClick={loadCisaData}
                title="Actualiser le flux CISA"
                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
              >
                <RefreshCw size={14} className={isLoadingCisa ? 'spin' : ''} />
              </button>
            )}
          </div>

          {/* TAB 1: CISA LIVE CVE FEED */}
          {activeTab === 'cisa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isLoadingCisa ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Chargement du flux officiel CISA KEV en direct...
                </div>
              ) : (
                filteredCisa.map((cve, idx) => (
                  <div key={idx} className="source-veille-card glass-panel" style={{ borderLeft: `3px solid ${cve.severity === 'CRITICAL' ? 'var(--red)' : 'var(--cyan)'}` }}>
                    <div className="source-header-row">
                      <a
                        href={getNvdUrl(cve.cveID)}
                        target="_blank"
                        rel="noreferrer"
                        className="source-title"
                        style={{ color: cve.severity === 'CRITICAL' ? 'var(--red)' : 'var(--cyan)' }}
                      >
                        <ShieldAlert size={16} />
                        {cve.cveID} — {cve.vendorProject} {cve.product}
                        <ExternalLink size={12} />
                      </a>
                      <span className="source-meta-tag" style={{ borderColor: cve.severity === 'CRITICAL' ? 'var(--red)' : 'var(--accent)' }}>
                        Ajouté: {cve.dateAdded}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.9rem', margin: '6px 0', color: 'var(--text-main)' }}>{cve.vulnerabilityName}</h4>
                    <p className="source-desc">{cve.shortDescription}</p>
                    <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--accent)' }}>ACTION REQUISE:</span> {cve.requiredAction}
                    </div>
                  </div>
                ))
              )}

              {!isLoadingCisa && filteredCisa.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Aucune alerte CVE ne correspond à votre recherche.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SOURCES & CURATION */}
          {activeTab === 'sources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredSources.map((source) => (
                <div key={source.id} className="source-veille-card glass-panel">
                  <div className="source-header-row">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="source-title"
                    >
                      <Globe size={16} />
                      {source.title}
                      <ExternalLink size={12} />
                    </a>
                    <span className="source-meta-tag">{source.frequency}</span>
                  </div>
                  <p className="source-desc">{source.description}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>IMPACT:</span>
                    <span style={{ color: 'var(--cyan)' }}>{source.impact}</span>
                  </div>
                </div>
              ))}

              {filteredSources.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Aucune source de veille ne correspond à votre recherche.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
