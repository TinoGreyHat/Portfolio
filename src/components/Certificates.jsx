import { useState } from 'react';
import { Award, ExternalLink, Lock, Unlock } from 'lucide-react';

// Read-only Certificates component

export default function Certificates({ certs }) {

  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title">
            <Award className="title-icon" size={28} />
            Certifications & Formations
            <div className="title-line"></div>
          </h2>
        </div>
        <p className="section-desc">
          Une vue d'ensemble des parcours académiques, des accréditations professionnelles
          et des cursus spécialisés en cybersécurité validés ou en cours d'acquisition.
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontSize: '0.8rem', marginLeft: 8 }}>
            [{certs.length} certification{certs.length !== 1 ? 's' : ''}]
          </span>
        </p>
      </div>

      {certs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <p style={{ marginBottom: 8 }}>Aucune certification enregistrée.</p>
        </div>
      ) : (
        <div className="certs-grid">
          {certs.map((cert) => (
            <div key={cert.id} className="cert-card glass-panel">
              <span className={`cert-status-tag ${cert.status === 'COMPLETED' ? 'completed' : 'in-progress'}`}>
                {cert.status === 'COMPLETED' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Unlock size={12} />
                    [VERIFIED: CLEARANCE]
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={12} />
                    [ACQUISITION: IN PROGRESS]
                  </span>
                )}
              </span>

              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-issuer">{cert.issuer}</p>

              <div className="cert-skills">
                {(cert.skills || []).map((skill, idx) => (
                  <span key={idx} className="cert-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="cert-footer">
                <span className="cert-date">{cert.date}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {cert.verificationLink && (
                    <a
                      href={cert.verificationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="cert-verify-link"
                    >
                      Vérifier
                      <ExternalLink size={12} />
                    </a>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
