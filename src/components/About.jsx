import { useState } from 'react';
import { User, Send, CheckCircle2, Shield, Calendar, BookOpen, Search } from 'lucide-react';

export default function About() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      // Simulate API/Formspree or email submission
      console.log('Sending message to blaisete2@gmail.com:', formData);
    }
  };

  const timelineData = [
    {
      date: "2023 - 2026",
      title: "Licence Professionnelle en Cybersécurité",
      desc: "Études supérieures focalisées sur la sécurité des systèmes d'information, l'architecture réseau sécurisée et la gestion des risques cybernétiques.",
      active: true
    },
    {
      date: "Décembre 2024",
      title: "Google Cybersecurity Professional",
      desc: "Certification technique couvrant l'analyse de paquets (Wireshark), la détection avec les SIEM (Splunk, Chronicle), le scripting Python pour la sécurité et la conformité NIST.",
      active: true
    },
    {
      date: "Début 2025",
      title: "Projets Labs & Wazuh SIEM",
      desc: "Création d'un laboratoire de détection d'attaques par force brute. Écriture de règles XML personnalisées de décodage de logs pour Wazuh SIEM.",
      active: true
    },
    {
      date: "2025 - 2026",
      title: "OffSec PEN-100 & Stage d'études",
      desc: "Préparation active aux bases de l'OSCP (PEN-100) et recherche d'une opportunité de stage de fin d'études ou d'alternance dans la sécurité offensive / SOC.",
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
          Découvrez mon parcours académique, mes aspirations professionnelles et envoyez un rapport 
          de communication sécurisé directement dans ma boîte de réception.
        </p>
      </div>

      <div className="about-layout">
        {/* Left column - Biography and Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="about-intro-text">
            <p>
              Je m'appelle <strong>TETE Kokou Blaise Etiam</strong> (alias <strong>TinoGreyHat</strong>). Étudiant en 3ème année de cybersécurité, j'ai développé une solide culture de l'analyse, du pentesting et de la défense opérationnelle.
            </p>
            <p>
              Ma philosophie s'ancre dans la <em>curiosité éthique</em> : je suis convaincu que pour concevoir des systèmes de défense impénétrables, il faut en comprendre la logique d'attaque. C'est pourquoi je consacre une grande partie de mon temps libre à concevoir des scripts d'audit en Python et à me confronter aux machines de TryHackMe.
            </p>
            <div className="about-highlight-box">
              "Analyser l'invisible, comprendre pour protéger et durcir les infrastructures face aux menaces de demain."
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
