export const skillsData = [
  {
    id: "offensive",
    title: "Sécurité Offensive (Red Team)",
    icon: "ShieldAlert",
    description: "Recherche active de vulnérabilités, tests d'intrusion et exploitation contrôlée.",
    skillsList: [
      { name: "Reconnaissance & Scan (Nmap, Gobuster, Nikto)", level: 85 },
      { name: "Exploitation de vulnérabilités (Metasploit, exploit-db)", level: 75 },
      { name: "Pentesting Web (OWASP Top 10, SQLi, XSS, CSRF)", level: 70 },
      { name: "Audit de protocoles (FTP, SSH, SMB, RDP)", level: 80 }
    ],
    tags: ["Nmap", "Metasploit", "Gobuster", "Burp Suite", "Kali Linux", "Wireshark"]
  },
  {
    id: "defensive",
    title: "Sécurité Défensive & Détection (Blue Team)",
    icon: "ShieldCheck",
    description: "Surveillance d'infrastructures, analyse de logs et mise en place de contre-mesures.",
    skillsList: [
      { name: "Supervision SIEM (Wazuh, ELK Stack)", level: 80 },
      { name: "Analyse de logs & forensic de base (Syslog, Event Viewer)", level: 75 },
      { name: "Détection d'intrusions (IDS/IPS Snort/Suricata)", level: 65 },
      { name: "Durcissement système (Hardening Linux & Windows)", level: 70 }
    ],
    tags: ["Wazuh", "SIEM", "IDS/IPS", "Syslog", "Analyse de Logs", "DFIR Basics"]
  },
  {
    id: "programming",
    title: "Scripting & Automatisation",
    icon: "Code",
    description: "Développement d'outils sur mesure et automatisation de tâches de sécurité.",
    skillsList: [
      { name: "Développement de scripts de sécurité (Python)", level: 85 },
      { name: "Automatisation système (Bash scripting)", level: 80 },
      { name: "Gestion de version & CI/CD (Git, GitHub)", level: 75 },
      { name: "Conteneurisation (Docker)", level: 60 }
    ],
    tags: ["Python", "Bash", "Git", "Docker", "Regex", "Automatisation"]
  },
  {
    id: "systems",
    title: "Systèmes & Réseaux",
    icon: "Terminal",
    description: "Administration sécurisée de serveurs et conception d'architectures réseau.",
    skillsList: [
      { name: "Administration Linux (Debian, Ubuntu, Rocky Linux)", level: 85 },
      { name: "Administration Windows Server & Active Directory", level: 65 },
      { name: "Protocoles réseau & routage (TCP/IP, DNS, DHCP)", level: 80 },
      { name: "Configuration de Firewalls & VPN (iptables, OpenVPN)", level: 70 }
    ],
    tags: ["Linux", "Active Directory", "TCP/IP", "DNS/DHCP", "VPN", "SSH/FTP"]
  }
];
