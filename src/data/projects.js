export const projectsData = [
  {
    id: 1,
    title: "Scanner de Ports Multi-threadé",
    category: "scripting",
    status: "COMPLETED",
    date: "Janvier 2025",
    tags: ["Python", "Sockets", "Threading", "Security Tools"],
    description: "Développement d'un scanner de ports réseau rapide et performant en Python utilisant le multi-threading pour accélérer la détection des services actifs.",
    details: "Ce projet vise à concevoir un outil de reconnaissance léger et rapide. En exploitant la bibliothèque 'threading' de Python, le script parvient à scanner de larges plages de ports en une fraction du temps nécessaire à un scan classique à un seul thread. Il intègre le Banner Grabbing (récupération de la bannière réseau) permettant d'identifier le nom et la version exacte des services en cours d'exécution (SSH, FTP, HTTP, etc.) afin d'aider à la détection de vulnérabilités connues.",
    githubLink: "https://github.com/TinoGreyHat/port-scanner-python"
  },
  {
    id: 2,
    title: "Audit & Durcissement d'un Service FTP",
    category: "pentest",
    status: "COMPLETED",
    date: "Février 2025",
    tags: ["Pentesting", "FTP", "Metasploit", "Hardening"],
    description: "Exploitation contrôlée d'une faille FTP (backdoor vsftpd 2.3.4) dans un lab local, suivie de la remédiation et de la sécurisation complète du serveur.",
    details: "Ce projet illustre une démarche complète de Pentest et de sécurisation (Red Team & Blue Team). En utilisant un environnement de laboratoire Metasploitable, j'ai identifié un service FTP vulnérable grâce à Nmap. J'ai ensuite exploité cette porte dérobée (vsftpd 2.3.4) avec Metasploit pour obtenir un shell root interactif. Enfin, j'ai appliqué les mesures de durcissement (hardening) : mise à jour du service, désactivation des connexions anonymes, restriction des permissions utilisateurs et configuration de règles iptables pour isoler le port.",
    githubLink: "https://github.com/TinoGreyHat/ftp-exploitation-hardening"
  },
  {
    id: 3,
    title: "Détection d'Attaques SIEM avec Wazuh",
    category: "defensive",
    status: "COMPLETED",
    date: "Mars 2025",
    tags: ["SIEM", "Wazuh", "SOC", "Active Response"],
    description: "Déploiement d'un agent de supervision Wazuh pour la détection en temps réel d'attaques par force brute SSH avec bannissement automatisé.",
    details: "Mise en place d'un environnement de détection et de réponse aux incidents. J'ai déployé un agent Wazuh sur un serveur Linux cible et configuré le gestionnaire Wazuh. J'ai rédigé des règles XML personnalisées pour analyser les logs d'authentification (`/var/log/auth.log`) et détecter les attaques par dictionnaire/force brute sur le service SSH. Pour bloquer l'attaque de manière proactive, j'ai configuré un script Active Response qui ajoute dynamiquement l'adresse IP de l'attaquant au pare-feu local.",
    githubLink: "https://github.com/TinoGreyHat/wazuh-siem-dashboard"
  },
  {
    id: 4,
    title: "Reverse Engineering d'un Crackme en C",
    category: "reverse",
    status: "IN_PROGRESS",
    date: "Avril 2025",
    tags: ["Ghidra", "x64dbg", "Assembleur", "Reverse Engineering"],
    description: "Analyse statique et dynamique d'un exécutable compilé en C pour en comprendre la logique d'authentification et en extraire le mot de passe secret.",
    details: "Projet d'apprentissage en rétro-ingénierie. À l'aide de Ghidra, j'ai effectué une analyse statique pour décompiler le binaire et identifier le flux de la fonction de validation de la licence (`strcmp` et calculs de hash simples). J'ai complété cette étude par une analyse dynamique pas à pas sous x64dbg afin d'examiner l'état des registres et de la pile (stack) mémoire au moment de la comparaison, réussissant à extraire la clé secrète en clair.",
    githubLink: "https://github.com/TinoGreyHat/reverse-engineering-crackme"
  }
];
