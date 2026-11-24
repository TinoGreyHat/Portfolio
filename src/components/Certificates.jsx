import { useState, useEffect } from 'react';
import { Award, ExternalLink, Lock, Unlock, ArrowLeft } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import { loadCerts } from '../services/apiService';

// Read-only Certificates component

export default function Certificates() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  const [certs, setCerts] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState(null);

  useEffect(() => {
    async function fetchCerts() {
      try {
        setLoading(true);
        const data = await loadCerts();
        setCerts(data || []);
      } catch (err) {
        console.error("Erreur de chargement des certifications:", err.message);
        setError(err.message);
        setCerts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, []);

  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <button className="page-back-btn" onClick={handleBack} aria-label={t('common.back')}>
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title">
            <Award className="title-icon" size={28} />
            {t('certificates.sectionTitle')}
            <div className="title-line"></div>
          </h2>
        </div>
        <p className="section-desc">
          {t('certificates.sectionDesc')}
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontSize: '0.8rem', marginLeft: 8 }}>
            {t('certificates.certCount', { count: certs.length })}
          </span>
        </p>
      </div>

      {certs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <p style={{ marginBottom: 8 }}>{t('certificates.noCerts')}</p>
        </div>
      ) : (
        <div className="certs-grid">
          {certs.map((cert) => (
            <div key={cert.id} className="cert-card glass-panel">
              <span className={`cert-status-tag ${cert.status === 'COMPLETED' ? 'completed' : 'in-progress'}`}>
                {cert.status === 'COMPLETED' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Unlock size={12} />
                    {t('certificates.badgeVerified')}
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={12} />
                    {t('certificates.badgeInProgress')}
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
                      {t('certificates.verify')}
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