export const skillsData = [
  {
    id: "defensive",
    title: "Sécurité Défensive & SOC (Blue Team)",
    icon: "ShieldCheck",
    description: "Supervision SIEM d'infrastructures, analyse de journaux d'événements, Threat Hunting et réponse aux incidents.",
    skillsList: [
      { name: "Supervision SIEM & Règles XML (Wazuh, ELK Stack, Splunk)", level: 90 },
      { name: "Analyse de logs & Threat Hunting (Syslog, Auth.log, Windows EventViewer)", level: 85 },
      { name: "Réponse aux Incidents & Active Response (Firewall Banning)", level: 80 },
      { name: "Durcissement d'infrastructures (Hardening Linux, Iptables)", level: 80 }
    ],
    tags: ["Wazuh SIEM", "Splunk", "Threat Hunting", "Syslog", "Active Response", "Hardening", "DFIR"]
  },
  {
    id: "programming",
    title: "Scripting & Automatisation Sécurité",
    icon: "Code",
    description: "Développement de scripts d'analyse sur mesure et automatisation de tâches SOC/Défensive.",
    skillsList: [
      { name: "Scripting d'outils de sécurité (Python)", level: 85 },
      { name: "Automatisation système & parseurs de logs (Bash / Regex)", level: 85 },
      { name: "Gestion de version & CI/CD (Git, GitHub)", level: 75 },
      { name: "Conteneurisation d'agents (Docker)", level: 65 }
    ],
    tags: ["Python", "Bash", "Regex Parsers", "Git", "Docker", "Automatisation SOC"]
  },
  {
    id: "systems",
    title: "Systèmes & Réseaux Sécurisés",
    icon: "Terminal",
    description: "Administration sécurisée de serveurs, filtrage réseau et isolation de services.",
    skillsList: [
      { name: "Administration Linux (Debian, Ubuntu, Rocky Linux)", level: 85 },
      { name: "Protocoles réseau & Analyse de paquets (TCP/IP, Wireshark)", level: 80 },
      { name: "Configuration Firewalls & Filtrage (Iptables, UFW, VPN)", level: 75 },
      { name: "Administration Windows Server & Active Directory (Bases)", level: 65 }
    ],
    tags: ["Linux Hardening", "Wireshark", "TCP/IP", "Iptables", "DNS/DHCP", "VPN"]
  },
  {
    id: "offensive",
    title: "Sécurité Offensive & Audit (Red Team)",
    icon: "ShieldAlert",
    description: "Compréhension de la mécanique d'attaque (OWASP, Pentesting) pour renforcer les défenses.",
    skillsList: [
      { name: "Scan de vulnérabilités & Reconnaissance (Nmap, Gobuster)", level: 80 },
      { name: "Audit de protocoles (FTP, SSH, SMB, RDP)", level: 75 },
      { name: "Pentesting Web & Analyse de failles (OWASP Top 10)", level: 70 },
      { name: "Compréhension des Exploits & Reverse (Metasploit, Ghidra)", level: 65 }
    ],
    tags: ["Nmap", "Metasploit", "Burp Suite", "OWASP", "Ghidra", "Wireshark"]
  }
];
