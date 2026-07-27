export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-cyber">
      <div className="section-container" style={{ padding: 0 }}>
        <p>
          © {currentYear} TinoGreyHat — Tous droits réservés. |{' '}
          <span className="footer-highlight">Cybersécurité & Hacking Éthique</span>
        </p>
      </div>
    </footer>
  );
}
