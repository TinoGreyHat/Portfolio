import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, ArrowLeft } from 'lucide-react';

export default function About() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleBack = () => navigate('/');

  const timelineData = [
    {
      date: "2023 - 2026",
      title: t('about.timeline[0].title'),
      desc: t('about.timeline[0].desc'),
      active: true
    },
    {
      date: "December 2024",
      title: t('about.timeline[1].title'),
      desc: t('about.timeline[1].desc'),
      active: true
    },
    {
      date: "Early 2025",
      title: t('about.timeline[2].title'),
      desc: t('about.timeline[2].desc'),
      active: true
    },
    {
      date: "2025 - 2026",
      title: t('about.timeline[3].title'),
      desc: t('about.timeline[3].desc'),
      active: false
    }
  ];

  return (
    <section className="section-container reveal visible about-page-wrapper">
      <div className="section-header">
        <button className="page-back-btn" onClick={handleBack} aria-label={t('common.back')}>
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
        </button>
        <h2 className="section-title">
          <User className="title-icon" size={28} />
          {t('about.sectionTitle')}
          <div className="title-line"></div>
        </h2>
        <p className="section-desc">
          {t('about.sectionDesc')}
        </p>
      </div>

      <div className="about-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div id="formation" className="about-intro-text">
            <p dangerouslySetInnerHTML={{ __html: t('about.intro1') }} />
            <p dangerouslySetInnerHTML={{ __html: t('about.intro2') }} />
            <div className="about-highlight-box">
              {t('about.highlightQuote')}
            </div>
          </div>

          <div id="experiences">
            <h3 className="timeline-title-sub">
              <BookOpen size={20} />
              {t('about.timelineTitle')}
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
      </div>
    </section>
  );
}