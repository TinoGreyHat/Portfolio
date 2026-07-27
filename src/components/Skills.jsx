import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Code, Terminal, Cpu } from 'lucide-react';
import { skillsData } from '../data/skills';

const iconMap = {
  ShieldAlert: ShieldAlert,
  ShieldCheck: ShieldCheck,
  Code: Code,
  Terminal: Terminal
};

export default function Skills() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Small timeout to trigger width expansion animation on page mount
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section-container reveal visible">
      <div className="section-header">
        <h2 className="section-title">
          <Cpu className="title-icon" size={28} />
          Mes Compétences Cyber
          <div className="title-line"></div>
        </h2>
        <p className="section-desc">
          Mon expertise technique se structure autour de la sécurité offensive, de la détection d'intrusions, 
          du scripting d'outils de sécurité et de l'administration réseau sécurisée.
        </p>
      </div>

      <div className="skills-grid">
        {skillsData.map((category) => {
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
