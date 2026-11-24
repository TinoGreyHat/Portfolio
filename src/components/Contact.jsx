import { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { sendContactMessage } from '../services/apiService';

export default function Contact() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.subject && formData.message) {
      setStatus('loading');

      try {
        await sendContactMessage(formData);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    } else {
      setStatus('error');
    }
  };

  return (
    <section className="section-container reveal visible about-page-wrapper">
      <div className="section-header">
        <button className="page-back-btn" onClick={handleBack} aria-label={t('common.back')}>
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
        </button>
        <h2 className="section-title">
          <Mail className="title-icon" size={28} />
          {t('contact.title')}
          <div className="title-line"></div>
        </h2>
        <p className="section-desc">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="about-layout" style={{ gridTemplateColumns: '1fr' }}>
        <div className="about-intro-text" style={{ maxWidth: '900px' }}>
          <p>
            {t('contact.intro')}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
          <div className="contact-container glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '40px' }}>
            <h3 className="contact-header">
              <Mail size={18} className="title-icon" />
              {t('contact.formTitle')}
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
                <h4 style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{t('contact.successTitle')}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {t('contact.successMessage')}
                </p>
                <button
                  className="cyber-btn sec"
                  style={{ marginTop: '20px' }}
                  onClick={() => {
                    setStatus('idle');
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                >
                  {t('contact.newMessageBtn')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {status === 'error' && (
                   <div style={{ color: 'var(--red)', marginBottom: '15px', fontSize: '0.85rem', padding: '10px', background: 'rgba(255, 62, 108, 0.1)', borderLeft: '3px solid var(--red)' }}>
                     {t('contact.errorMessage')}
                   </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div className="form-group-cyber">
                    <label className="form-label-cyber" htmlFor="name">{t('contact.form.name')}</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-input-cyber"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('contact.form.fullNamePlaceholder')}
                      required
                    />
                  </div>

                  <div className="form-group-cyber">
                    <label className="form-label-cyber" htmlFor="email">{t('contact.form.email')}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input-cyber"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('contact.form.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-cyber" style={{ marginTop: '20px' }}>
                  <label className="form-label-cyber" htmlFor="subject">{t('contact.form.subject')}</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="form-input-cyber"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    required
                  />
                </div>

                <div className="form-group-cyber" style={{ marginTop: '20px' }}>
                  <label className="form-label-cyber" htmlFor="message">{t('contact.form.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-input-cyber"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.form.messagePlaceholder')}
                    required
                    style={{ minHeight: '150px' }}
                  />
                </div>

                <button type="submit" className="cyber-btn" disabled={status === 'loading'} style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '15px' }}>
                  {status === 'loading' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="loading-spinner" style={{ width: '18px', height: '18px', border: '2px solid transparent', borderTopColor: 'var(--bg-cyber)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                      {t('contact.form.sending')}
                    </span>
                  ) : (
                    <>
                      <Send size={18} />
                      {t('contact.form.send')}
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