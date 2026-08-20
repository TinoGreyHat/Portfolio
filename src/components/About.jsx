import { useState } from 'react';
import { User, Send, CheckCircle2, Shield, BookOpen } from 'lucide-react';

export default function About() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      const subject = encodeURIComponent(`[Portfolio Transmission] Message de ${formData.name}`);
      const body = encodeURIComponent(`Identité : ${formData.name}\nEmail : ${formData.email}\n\nMessage :\n${formData.message}`);
      window.location.href = `mailto:blaisete2@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  const timelineData = [
    {
      date: "2023 - 2026",
      title: "Spécialisation Cybersécurité & Hacking Éthique",
      desc: "Cursus supérieur axé sur la sécurité des SI, l'architecture réseau sécurisée, l'audit de code, la cryptographie et la gestion des risques cyber (NIST / ISO 27001).",
      active: true
    },
    {
      date: "Décembre 2024",
      title: "Google Cybersecurity Professional",
      desc: "Certification technique validant l'analyse avancée de paquets (Wireshark), la détection SIEM (Splunk, Chronicle), le scripting Python de sécurité et la conformité aux frameworks.",
      active: true
    },
    {
      date: "Début 2025",
      title: "Laboratoires SOC & Détection Wazuh SIEM",
      desc: "Conception d'un lab de Threat Hunting. Déploiement d'agents de supervision, écriture de règles XML sur-mesure pour détection de bruteforce et riposte Active Response.",
      active: true
    },
    {
      date: "2025 - 2026",
      title: "OffSec PEN-100 & Stage Pentest / SOC",
      desc: "Préparation active aux fondations de l'OSCP (PEN-100) et recherche d'un stage ou d'une alternance en Sécurité Offensive (Pentest) ou Analyse SOC.",
      active: false
    }
  ];

  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <h2 className="section-title">
          <User className="title-icon" size={28} />
          À Propos de moi
          <div className="title-line"></div>
        </h2>
        <p className="section-desc">
          Mon parcours, mes objectifs professionnels, mes laboratoires de recherche et le 
          canal de communication sécurisé.
        </p>
      </div>

      <div className="about-layout">
        {/* Left column - Biography and Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="about-intro-text">
            <p>
              Je m'appelle <strong>TETE Kokou Blaise Etiam</strong> (alias <strong>TinoGreyHat</strong>). Praticien passionné de sécurité défensive (Blue Team & SOC), je suis spécialisé dans la supervision SIEM (Wazuh, Splunk), la recherche de menaces (Threat Hunting), l'analyse de logs et le durcissement des systèmes.
            </p>
            <p>
              Ma philosophie s'ancre dans la <em>vigilance proactive & la défense en profondeur</em> : surveiller les flux en continu, corrélera les signaux faibles et automatiser les réponses aux incidents (Active Response) pour neutraliser les attaques dès les premières étapes du Kill Chain.
            </p>
            <div className="about-highlight-box">
              "Surveiller l'invisible, corréler les événements de sécurité et immuniser les infrastructures face aux menaces émergentes."
            </div>
          </div>

          <div>
            <h3 className="timeline-title-sub">
              <BookOpen size={20} />
              Cursus & Jalons
            </h3>
            <div className="timeline-vertical">
              {timelineData.map((node, index) => (
                <div key={index} className={`timeline-node ${node.active ? 'active' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-node-header">
                    <span className="timeline-node-date">{node.date}</span>
                  </div>
                  <h4 className="timeline-node-title">{node.title}</h4>
                  <p className="timeline-node-desc">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Secure contact Console */}
        <div>
          <div className="contact-container glass-panel">
            <h3 className="contact-header">
              <Shield size={18} className="title-icon" />
              SECURE_TRANSMISSION_PROTOCOL
            </h3>

            {submitted ? (
              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '30px 0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '16px' 
                }}
              >
                <CheckCircle2 size={48} style={{ color: 'var(--accent)' }} />
                <h4 style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>REPORT_SENT_SUCCESSFULLY</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Merci pour votre message. La connexion sécurisée a été fermée. Je vous répondrai dans les meilleurs délais.
                </p>
                <button 
                  className="cyber-btn sec" 
                  style={{ marginTop: '10px' }}
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                >
                  Ouvrir une nouvelle session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group-cyber">
                  <label className="form-label-cyber">Sender Name [Identité]</label>
                  <input 
                    type="text" 
                    className="form-input-cyber"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Jean Dupont"
                    required
                  />
                </div>

                <div className="form-group-cyber">
                  <label className="form-label-cyber">Sender Email [Canal de retour]</label>
                  <input 
                    type="email" 
                    className="form-input-cyber"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ex: jean.dupont@sec-agency.com"
                    required
                  />
                </div>

                <div className="form-group-cyber">
                  <label className="form-label-cyber">Encrypted Payload [Message]</label>
                  <textarea 
                    className="form-input-cyber"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Saisissez votre message ici..."
                    required
                  />
                </div>

                <button type="submit" className="cyber-btn">
                  <Send size={14} />
                  Transmettre le rapport
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
