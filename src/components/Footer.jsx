import { useI18n } from '../contexts/I18nContext';

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-cyber">
      <div className="section-container" style={{ padding: 0 }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {t('footer.copyright', { year: currentYear })} |{' '}
          <span className="footer-highlight">{t('footer.madeWith')}</span>
          <a href="/admin" title={t('footer.adminLink')} style={{ color: 'var(--text-subtle)', marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </a>
        </p>
      </div>
    </footer>
  );
}