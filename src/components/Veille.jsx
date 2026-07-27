import { useState, useEffect, useRef } from 'react';
import { Activity, Globe, ExternalLink, Search } from 'lucide-react';
import { sourcesVeille, simulatedAlerts } from '../data/veille';

export default function Veille() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  // Initialize logs on load
  useEffect(() => {
    // Populate with 6 random initial alerts from simulatedAlerts
    const shuffled = [...simulatedAlerts].sort(() => 0.5 - Math.random());
    const initial = shuffled.slice(0, 6).map((item, idx) => {
      // Offset time dynamically for realism
      const d = new Date();
      d.setMinutes(d.getMinutes() - (6 - idx) * 3);
      const timeStr = d.toTimeString().split(' ')[0];
      return { ...item, time: timeStr };
    });
    setLogs(initial);
  }, []);

  // Simulate threat intelligence ingestion feed
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAlert = simulatedAlerts[Math.floor(Math.random() * simulatedAlerts.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      setLogs(prevLogs => {
        const updated = [...prevLogs, { ...randomAlert, time: timeStr }];
        // Keep last 15 logs to prevent excessive memory usage
        if (updated.length > 15) {
          return updated.slice(updated.length - 15);
        }
        return updated;
      });
    }, 3500); // New event every 3.5s

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredSources = sourcesVeille.filter(source => 
    source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          Supervision des menaces émergentes, des nouvelles vulnérabilités (NVD CVE) et 
          des outils de pentesting partagés par la communauté.
        </p>
      </div>

      <div className="veille-layout">
        {/* Left column - Live threat feed / SOC simulator */}
        <div>
          <div className="soc-monitor">
            <div className="soc-header">
              <div className="soc-status-indicator">
                <span className="status-dot-blink"></span>
                <span>CYBER_THREAT_INTEL_MONITOR (SIMULATED_SOC)</span>
              </div>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                RATE: ~0.3 EPS
              </span>
            </div>

            <div className="soc-body">
              <div style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(0,232,155,0.1)', paddingBottom: '8px', marginBottom: '8px' }}>
                [+] Log Ingestion Active. Listening to global CVE feeds and hacktivism boards...
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

        {/* Right column - Curation sources list */}
        <div className="veille-sources-section">
          {/* Search bar */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.15)',
              border: '1px solid var(--border-cyber)',
              borderRadius: '4px',
              padding: '6px 12px',
              gap: '10px'
            }}
          >
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filtrer les sources de veille..."
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
          </div>

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
      </div>
    </section>
  );
}
