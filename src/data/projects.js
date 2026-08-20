export const projectsData = [
  {
    id: 1,
    title: "Scanner de Ports Multi-threadé & Banner Grabber",
    category: "scripting",
    status: "COMPLETED",
    date: "Janvier 2025",
    tags: ["Python", "Sockets", "Threading", "Reconnaissance"],
    description: "Tooling Offensif : Outil de reconnaissance réseau hautes performances en Python exploitant le multi-threading et le Banner Grabbing automatisé.",
    details: "Développement d'un scanner de ports custom pour accélérer la phase de recon (reconnaissance) lors d'un audit de sécurité. En exploitant la programmation asynchrone/multi-threadée en Python, l'outil scanne des plages de ports IP en quelques secondes. Il extrait automatiquement les bannières réseau des services (SSH, FTP, HTTP) pour croiser les versions identifiées avec la base de données de failles connues (CVE).",
    githubLink: "https://github.com/TinoGreyHat/port-scanner-python"
  },
  {
    id: 2,
    title: "Exploitation Controlled vsftpd & Hardening System",
    category: "pentest",
    status: "COMPLETED",
    date: "Février 2025",
    tags: ["Pentesting", "Metasploit", "Root Shell", "Hardening"],
    description: "Simulation Red/Blue Team : Du Remote Shell Root (backdoor vsftpd 2.3.4) jusqu'au durcissement système et à l'isolation réseau via iptables.",
    details: "Démonstration complète de la chaîne d'attaque et de la remédiation. Phase Red Team : Scan de vulnérabilités Nmap, exploitation de la porte dérobée historique vsftpd 2.3.4 via Metasploit et obtention d'un accès Root interactif. Phase Blue Team : Application du correctif, désactivation des accès anonymes, chroot des utilisateurs FTP et déploiement de règles Iptables strictes pour filtrer l'accès au service.",
    githubLink: "https://github.com/TinoGreyHat/ftp-exploitation-hardening"
  },
  {
    id: 3,
    title: "Architecture SOC & Détection d'Attaques Wazuh SIEM",
    category: "defensive",
    status: "COMPLETED",
    date: "Mars 2025",
    tags: ["SIEM", "Wazuh", "Threat Hunting", "Active Response"],
    description: "Supervision & Threat Hunting : Déploiement d'un agent Wazuh SIEM, écriture de règles XML sur-mesure et réponse automatisée (Active Response).",
    details: "Mise en place d'un SOC de laboratoire pour la détection proactive des menaces. Déploiement d'agents de supervision sur cibles Linux. Écriture de décodeurs et de règles d'alerte XML personnalisées pour analyser `/var/log/auth.log` et intercepter les attaques par dictionnaire/force brute SSH. Configuration d'un script d'Active Response pour bannir automatiquement les IP attaquantes au niveau du pare-feu dès le franchissement de seuil d'alerte.",
    githubLink: "https://github.com/TinoGreyHat/wazuh-siem-dashboard"
  },
  {
    id: 4,
    title: "Reverse Engineering d'un Binaire Obfusqué en C",
    category: "reverse",
    status: "IN_PROGRESS",
    date: "Avril 2025",
    tags: ["Ghidra", "x64dbg", "Assembleur x86", "Reverse Engineering"],
    description: "Analyse Malware & Reverse : Rétro-ingénierie statique et dynamique sous Ghidra & x64dbg pour décompiler la logique de licence et extraire le secret.",
    details: "Analyse binaire approfondie. Phase Statique : Décompilation de l'exécutable C avec Ghidra pour reconstituer le graphe de contrôle de flux et isoler les fonctions de validation de mot de passe. Phase Dynamique : Exécution contrôlée sous debugger x64dbg avec pose de breakpoints sur les registres EAX/RAX et inspection de la mémoire stack pour extraire la clé de licence en clair.",
    githubLink: "https://github.com/TinoGreyHat/reverse-engineering-crackme"
  }
];
