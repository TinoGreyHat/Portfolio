import { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin } from 'lucide-react';
import { sendContactMessage } from '../services/apiService';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.subject && formData.message) {
      setStatus('loading');
      
      try {
        await sendContactMessage(formData);
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    } else {
      setStatus('error');
    }
  };

  return (
    <section className="section-container reveal visible about-page-wrapper">
      <div className="section-header">
        <h2 className="section-title">
          <Mail className="title-icon" size={28} />
          CONTACT
          <div className="title-line"></div>
        </h2>
        <p className="section-desc">
          Une question, une collaboration ou une opportunité ? Échangeons.
        </p>
      </div>

      <div className="about-layout" style={{ gridTemplateColumns: '1fr' }}>
        <div className="about-intro-text" style={{ maxWidth: '900px' }}>
          <p>
            Vous pouvez me contacter pour discuter d’un projet, d’une collaboration, d’une opportunité professionnelle ou d’un sujet lié à la cybersécurité.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
          <div className="contact-container glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '40px' }}>
            <h3 className="contact-header">
              <Mail size={18} className="title-icon" />
              FORMULAIRE DE CONTACT
            </h3>

            {status === 'success' ? (
              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '40px 0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '16px' 
                }}
              >
                <CheckCircle2 size={56} style={{ color: 'var(--accent)' }} />
                <h4 style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>MESSAGE ENVOYÉ</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Merci pour votre message. Je vous répondrai dans les meilleurs délais.
                </p>
                <button 
                  className="cyber-btn sec" 
                  style={{ marginTop: '20px' }}
                  onClick={() => {
                    setStatus('idle');
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                >
                  Nouveau message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {status === 'error' && (
                   <div style={{ color: 'var(--red)', marginBottom: '15px', fontSize: '0.85rem', padding: '10px', background: 'rgba(255, 62, 108, 0.1)', borderLeft: '3px solid var(--red)' }}>
                     Une erreur est survenue. Veuillez réessayer.
                   </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div className="form-group-cyber">
                    <label className="form-label-cyber" htmlFor="name">Nom complet</label>
                    <input 
                      id="name"
                      name="name"
                      type="text" 
                      className="form-input-cyber"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: Jean Dupont"
                      required
                    />
                  </div>

                  <div className="form-group-cyber">
                    <label className="form-label-cyber" htmlFor="email">Email</label>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      className="form-input-cyber"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ex: jean.dupont@sec-agency.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-cyber" style={{ marginTop: '20px' }}>
                  <label className="form-label-cyber" htmlFor="subject">Sujet</label>
                  <input 
                    id="subject"
                    name="subject"
                    type="text" 
                    className="form-input-cyber"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="ex: Proposition de collaboration"
                    required
                  />
                </div>

                <div className="form-group-cyber" style={{ marginTop: '20px' }}>
                  <label className="form-label-cyber" htmlFor="message">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    className="form-input-cyber"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Saisissez votre message ici..."
                    required
                    style={{ minHeight: '150px' }}
                  />
                </div>

                <button type="submit" className="cyber-btn" disabled={status === 'loading'} style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '15px' }}>
                  {status === 'loading' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="loading-spinner" style={{ width: '18px', height: '18px', border: '2px solid transparent', borderTopColor: 'var(--bg-cyber)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                      Envoi en cours...
                    </span>
                  ) : (
                    <>
                      <Send size={18} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
