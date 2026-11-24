import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Code, Terminal, Cpu, ArrowLeft } from 'lucide-react';
import { skillsData } from '../data/skills';
import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  ShieldAlert: ShieldAlert,
  ShieldCheck: ShieldCheck,
  Code: Code,
  Terminal: Terminal
};

// Skill translation keys mapping - matches the locale structure skills.{category}.skills
const skillKeys = {
  defensive: ['siem', 'logs', 'response', 'hardening'],
  programming: ['python', 'bash', 'git', 'docker'],
  systems: ['linux', 'network', 'firewall', 'windows'],
  offensive: ['scan', 'audit', 'web', 'reverse'],
};

export default function Skills() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Small timeout to trigger width expansion animation on page mount
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Translate skills data based on current language
  const translatedSkills = skillsData.map(category => {
    const catKey = category.id;
    return {
      ...category,
      title: t(`skills.${catKey}.title`),
      description: t(`skills.${catKey}.description`),
      skillsList: category.skillsList.map((skill, index) => {
        const keys = skillKeys[catKey] || [];
        const translationKey = keys[index] || index;
        return {
          ...skill,
          name: t(`skills.${catKey}.skills.${translationKey}`),
        };
      }),
      tags: t(`skills.${catKey}.tags`),
    };
  });

  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <button className="page-back-btn" onClick={handleBack} aria-label={t('common.back')}>
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
        </button>
        <h2 className="section-title">
          <Cpu className="title-icon" size={28} />
          {t('skills.sectionTitle')}
          <div className="title-line"></div>
        </h2>
        <p className="section-desc">
          {t('skills.sectionDesc')}
        </p>
      </div>

      <div className="skills-grid">
        {translatedSkills.map((category) => {
          const IconComponent = iconMap[category.icon] || Cpu;
          return (
            <div key={category.id} className="skill-category-card glass-panel">
              <div className="skills-cat-header">
                <IconComponent className="skills-cat-icon" size={26} />
                <h3 className="skills-cat-title">{category.title}</h3>
              </div>
              <p className="skills-cat-desc">{category.description}</p>

              <div className="skills-list">
                {category.skillsList.map((skill, index) => (
                  <div key={index} className="skill-progress-item">
                    <div className="skill-progress-info">
                      <span className="skill-progress-name">{skill.name}</span>
                      <span className="skill-progress-value">{skill.level}%</span>
                    </div>
                    <div className="skill-progress-bar">
                      <div
                        className="skill-progress-fill"
                        style={{ width: animated ? `${skill.level}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="skills-tags-container">
                {category.tags.map((tag, idx) => (
                  <span key={idx} className="skill-tag-badge">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
