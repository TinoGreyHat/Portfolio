import { useState } from 'react';
import { Award, ExternalLink, Lock, Unlock, Plus, X } from 'lucide-react';

const EMPTY_CERT_FORM = {
  title: '',
  issuer: '',
  status: 'COMPLETED',
  date: '',
  skills: '',
  verificationLink: '',
};

function AddCertModal({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY_CERT_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Champ requis.';
    if (!form.issuer.trim()) e.issuer = 'Champ requis.';
    if (!form.date.trim()) e.date = 'Champ requis.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    onAdd({
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      status: form.status,
      date: form.date.trim(),
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      verificationLink: form.verificationLink.trim() || null,
      credentialId: `USER-CERT-${Date.now()}`,
      badge: 'custom',
    });
    onClose();
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: undefined })); },
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-cyber glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header-section">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan)', marginBottom: 8, letterSpacing: 1 }}>
            [ADD_CERTIFICATION_RECORD]
          </div>
          <h3 className="modal-title" style={{ fontSize: '1.4rem' }}>
            <Plus size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Ajouter une Certification
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Titre */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Titre de la Certification / Formation <span style={{ color: 'var(--red)' }}>*</span></label>
            <input className="form-input-cyber" placeholder="ex: Junior Penetration Tester" {...field('title')} />
            {errors.title && <span style={{ color: 'var(--red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>⚠ {errors.title}</span>}
          </div>

          {/* Organisme */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Organisme / Plateforme <span style={{ color: 'var(--red)' }}>*</span></label>
            <input className="form-input-cyber" placeholder="ex: TryHackMe, Coursera, OffSec, Cisco..." {...field('issuer')} />
            {errors.issuer && <span style={{ color: 'var(--red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>⚠ {errors.issuer}</span>}
          </div>

          {/* Statut / Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group-cyber">
              <label className="form-label-cyber">Statut</label>
              <select className="form-input-cyber" {...field('status')}>
                <option value="COMPLETED">[VERIFIED: CLEARANCE] — Obtenu</option>
                <option value="IN_PROGRESS">[ACQUISITION: IN PROGRESS] — En cours</option>
              </select>
            </div>
            <div className="form-group-cyber">
              <label className="form-label-cyber">Date / Période <span style={{ color: 'var(--red)' }}>*</span></label>
              <input className="form-input-cyber" placeholder="ex: Décembre 2024, En cours" {...field('date')} />
              {errors.date && <span style={{ color: 'var(--red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>⚠ {errors.date}</span>}
            </div>
          </div>

          {/* Compétences / Tags */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Tags / Compétences acquises (séparées par des virgules)</label>
            <input className="form-input-cyber" placeholder="ex: Pentesting, Analyse de logs, Python, Sécurité Web" {...field('skills')} />
          </div>

          {/* Lien de vérification */}
          <div className="form-group-cyber">
            <label className="form-label-cyber">Lien de Vérification (optionnel)</label>
            <input className="form-input-cyber" type="url" placeholder="https://coursera.org/verify/..." {...field('verificationLink')} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18, marginTop: 4 }}>
            <button type="button" className="cyber-btn sec" onClick={onClose}>
              <X size={14} /> Annuler
            </button>
            <button type="submit" className="cyber-btn">
              <Plus size={14} /> Ajouter la Certification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Certificates({ certs, addCert }) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title">
            <Award className="title-icon" size={28} />
            Certifications & Formations
            <div className="title-line"></div>
          </h2>
          {/* ADD BUTTON */}
          <button
            className="cyber-btn"
            onClick={() => setShowAddModal(true)}
            title="Ajouter une nouvelle certification"
            style={{ flexShrink: 0, padding: '9px 18px', fontSize: '0.82rem' }}
          >
            <Plus size={16} />
            Ajouter
          </button>
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
          <button className="cyber-btn sec" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Ajouter votre première certification
          </button>
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
          ))}
        </div>
      )}

      {/* Add Cert Modal */}
      {showAddModal && (
        <AddCertModal
          onAdd={addCert}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </section>
  );
}
