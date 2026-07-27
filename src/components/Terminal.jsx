import { useState, useRef, useEffect } from 'react';

const LS_PROJECTS_KEY = 'tinogreyhat_projects';
const LS_CERTS_KEY = 'tinogreyhat_certs';

export default function Terminal({ projects: propProjects, certs: propCerts }) {
  const [history, setHistory] = useState([
    "System initialization... OK",
    "Loading secure protocols... OK",
    "Type 'help' to display available command lists.",
    ""
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Read live data: props first, then localStorage, then static fallbacks
  const getLiveProjects = () => {
    if (propProjects && propProjects.length > 0) return propProjects;
    try {
      const stored = localStorage.getItem(LS_PROJECTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [];
  };

  const getLiveCerts = () => {
    if (propCerts && propCerts.length > 0) return propCerts;
    try {
      const stored = localStorage.getItem(LS_CERTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [];
  };

  const commands = {
    help: () => [
      "Commandes disponibles :",
      "  whoami      - Affiche des informations sur mon profil.",
      "  skills      - Affiche mon éventail de compétences en cybersécurité.",
      "  projects    - Liste mes projets techniques.",
      "  certs       - Liste mes certifications et diplômes.",
      "  veille      - Affiche mes sources de veille technologique.",
      "  contact     - Affiche mes coordonnées et liens sociaux.",
      "  neofetch    - Affiche les spécifications du système avec un logo ASCII.",
      "  clear       - Efface le terminal.",
      "  cat <file>  - Lit le contenu d'un fichier (ex: cat flag.txt)."
    ],
    whoami: () => [
      "Profil : TETE Kokou Blaise Etiam",
      "Alias  : TinoGreyHat",
      "Rôle   : Étudiant de 3ème année en Cybersécurité & Hacking Éthique",
      "Statut : Recherche de stage / alternance en sécurité offensive ou SOC",
      "Focus  : Analyse de vulnérabilités, Pentesting, SIEM Wazuh, Scripting Python/Bash"
    ],
    skills: () => [
      "Compétences Techniques :",
      "  [+] Red Team   : Nmap, Gobuster, Metasploit, Web Pentesting (OWASP)",
      "  [+] Blue Team  : SIEM Wazuh, Analyse de logs (Syslog), Hardening Linux",
      "  [+] Scripting  : Python (outils de sécurité), Bash automation, Git",
      "  [+] Systèmes   : Administration Linux avancée, Réseaux (TCP/IP, routage)"
    ],
    projects: () => {
      const liveProjects = getLiveProjects();
      if (liveProjects.length === 0) return ["Aucun projet enregistré. Ajoutez-en un depuis la page Projets."];
      return [
        `Projets (${liveProjects.length} total) :`,
        ...liveProjects.map((p, i) =>
          `  ${i + 1}. [${p.status === 'COMPLETED' ? '✔' : '→'}] ${p.title} — ${p.description ? p.description.slice(0, 60) + '...' : 'Voir les détails dans Projets.'}`
        )
      ];
    },
    certs: () => {
      const liveCerts = getLiveCerts();
      if (liveCerts.length === 0) return ["Aucune certification enregistrée. Ajoutez-en une depuis la page Certificats."];
      return [
        `Certifications (${liveCerts.length} total) :`,
        ...liveCerts.map((c) =>
          `  [${c.status === 'COMPLETED' ? '✔' : '→'}] ${c.title} — ${c.issuer} (${c.date})`
        )
      ];
    },
    veille: () => [
      "Veille Technologique - Sources clés :",
      "  - The Hacker News (Cyber-actualités)",
      "  - KitPloit (Outils de hacking & de défense)",
      "  - NIST NVD (Nouvelles failles & scores CVSS)",
      "  - GitHub Trending (Sécurité & PoC)"
    ],
    contact: () => [
      "Transmission Sécurisée - Contact :",
      "  - Email    : blaisete2@gmail.com",
      "  - GitHub   : github.com/TinoGreyHat",
      "  - LinkedIn : linkedin.com/in/tinogreyhat"
    ],
    neofetch: () => [
      "  TinoGreyHat@cyber-ops",
      "  ---------------------",
      "  OS      : CyberOps GNU/Linux x86_64",
      "  Kernel  : 6.12.0-security-hardened",
      "  Shell   : bash 5.2.21",
      "  Uptime  : 3 years of study",
      "  CPU     : Ethical-Hacker-Mind (8) @ 4.80GHz",
      "  Memory  : 16GB (Learning) / 32GB (Target)",
      "  IDE     : Antigravity Code Editor",
      "  Status  : [SYSTEM: SECURE]"
    ],
    "cat flag.txt": () => [
      "⚡ FÉLICITATIONS ! Vous avez trouvé le flag caché dans le système !",
      "🔑 FLAG: THM{C1ph3r_G0d_T1n0_Gr3y_H4t_5ecur1ty}"
    ]
  };

  const handleCommand = (cmdStr) => {
    const trimmed = cmdStr.trim().toLowerCase();
    let response = [];

    if (trimmed === "") {
      response = [""];
    } else if (trimmed === "clear") {
      setHistory([]);
      return;
    } else if (commands[trimmed]) {
      response = commands[trimmed]();
    } else if (trimmed.startsWith("cat ")) {
      const fileName = trimmed.substring(4).trim();
      if (fileName === "flag.txt") {
        response = commands["cat flag.txt"]();
      } else {
        response = [`cat: ${fileName}: Aucun fichier de ce nom dans le répertoire racine.`];
      }
    } else {
      response = [
        `Command not found: '${cmdStr}'.`,
        "Type 'help' to see the list of valid commands."
      ];
    }

    setHistory((prev) => [...prev, `guest@tinogreyhat:~$ ${cmdStr}`, ...response, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setCmdHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);
    handleCommand(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInput(cmdHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      setInput(nextIndex === -1 ? '' : cmdHistory[nextIndex] || '');
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="terminal-card" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="term-btn red"></div>
          <div className="term-btn yellow"></div>
          <div className="term-btn green"></div>
        </div>
        <div className="terminal-title">guest@tinogreyhat: ~ (bash)</div>
        <div className="terminal-indicator">
          <span className="blink-caret" style={{ width: 6, height: 6, borderRadius: '50%' }}></span>
          <span>ONLINE</span>
        </div>
      </div>

      <div className="terminal-body">
        {history.map((line, idx) => (
          <div key={idx} className="term-output-line">
            {line}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="term-prompt-line">
          <span className="term-prompt">guest@tinogreyhat:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            spellCheck="false"
            placeholder="entrez une commande..."
          />
        </form>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
