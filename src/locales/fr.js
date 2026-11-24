export default {
  // Navigation
  nav: {
    home: 'Accueil',
    roadmap: 'Roadmap',
    skills: 'Compétences',
    projects: 'Projets',
    certificates: 'Certificats',
    about: 'À propos',
    experiences: 'Expériences',
    formation: 'Formation',
    contact: 'Contact',
    veille: 'Veille',
  },

  // Common
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    viewDetails: 'Voir les détails',
    seeMore: 'Voir plus',
    seeLess: 'Voir moins',
    language: 'Langue',
    theme: 'Thème',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    system: 'Système',
  },

  // Home Page
  home: {
    title: 'Portfolio Cybersécurité & Hacking Éthique',
    subtitle: 'Étudiant en Cybersécurité & Hacking Éthique',
    systemStatus: 'SYSTEM STATUS: OPERATIONAL',
    profileName: 'TETE Kokou Blaise Etiam',
    profileAlias: 'TinoGreyHat',
    bio: 'Passionné par la cybersécurité offensive et défensive, je développe des outils, réalise des audits et partage ma veille technologique. Mon objectif : devenir RSSI.',
    stats: {
      projects: 'Projets',
      certifications: 'Certifications',
      skills: 'Compétences',
      experience: 'Années d\'expérience',
      tryhackme: 'Rang TryHackMe',
      cyberProjects: 'Projets Cyber',
      certificationsShort: 'Certifications',
      languages: 'Langages Favoris',
    },
    cta: {
      viewProjects: 'Voir mes projets',
      viewRoadmap: 'Voir ma roadmap',
      contactMe: 'Me contacter',
      downloadCV: 'Télécharger mon CV',
    },
    titles: [
      'Analyste SOC & Blue Team Specialist',
      'Threat Hunter & Expert Wazuh SIEM',
      'Spécialiste en Détection d\'Incidents & Hardening',
      'Security Engineer & Analyse de Logs (Syslog/ELK)'
    ],
    badges: [
      '[ROLE: BLUE TEAM / SOC]',
      '[SIEM: WAZUH / SPLUNK]',
      '[HARDENING: LINUX / NET]'
    ],
    social: {
      github: 'Profil GitHub',
      linkedin: 'Profil LinkedIn',
      tryhackme: 'Profil TryHackMe',
    },
  },

  // About Page - MERGED: base + extended keys
  about: {
    title: 'À propos',
    subtitle: 'Mon parcours et ma philosophie',
    journey: 'Mon parcours',
    philosophy: 'Ma philosophie',
    values: {
      curiosity: 'Curiosité technique',
      rigor: 'Rigueur méthodologique',
      sharing: 'Partage des connaissances',
      ethics: 'Éthique du hacker',
    },
    education: 'Formation',
    experience: 'Expérience',
    sectionTitle: 'À Propos de moi',
    sectionDesc: 'Mon parcours, mes objectifs professionnels et mes laboratoires de recherche.',
    intro1: 'Je m\'appelle <strong>TETE Kokou Blaise Etiam</strong> (alias <strong>TinoGreyHat</strong>). Praticien passionné de sécurité défensive (Blue Team & SOC), je suis spécialisé dans la supervision SIEM (Wazuh, Splunk), la recherche de menaces (Threat Hunting), l\'analyse de logs et le durcissement des systèmes.',
    intro2: 'Ma philosophie s\'ancre dans la <em>vigilance proactive & la défense en profondeur</em> : surveiller les flux en continu, corrélera les signaux faibles et automatiser les réponses aux incidents (Active Response) pour neutraliser les attaques dès les premières étapes du Kill Chain.',
    highlightQuote: '"Surveiller l\'invisible, corréler les événements de sécurité et immuniser les infrastructures face aux menaces émergentes."',
    timelineTitle: 'Cursus & Jalons',
    timeline: [
      {
        date: '2023 - 2026',
        title: 'Spécialisation Cybersécurité & Hacking Éthique',
        desc: 'Cursus supérieur axé sur la sécurité des SI, l\'architecture réseau sécurisée, l\'audit de code, la cryptographie et la gestion des risques cyber (NIST / ISO 27001).',
      },
      {
        date: 'Décembre 2024',
        title: 'Google Cybersecurity Professional',
        desc: 'Certification technique validant l\'analyse avancée de paquets (Wireshark), la détection SIEM (Splunk, Chronicle), le scripting Python de sécurité et la conformité aux frameworks.',
      },
      {
        date: 'Début 2025',
        title: 'Laboratoires SOC & Détection Wazuh SIEM',
        desc: 'Conception d\'un lab de Threat Hunting. Déploiement d\'agents de supervision, écriture de règles XML sur-mesure pour détection de bruteforce et riposte Active Response.',
      },
      {
        date: '2025 - 2026',
        title: 'OffSec PEN-100 & Stage Pentest / SOC',
        desc: 'Préparation active aux fondations de l\'OSCP (PEN-100) et recherche d\'un stage ou d\'une alternance en Sécurité Offensive (Pentest) ou Analyse SOC.',
      },
    ],
  },

  // Skills Page
  skills: {
    title: 'Compétences',
    subtitle: 'Technologies et domaines maîtrisés',
    categories: {
      offensive: 'Offensif / Red Team',
      defensive: 'Défensif / Blue Team',
      programming: 'Programmation & Scripting',
      infrastructure: 'Infrastructure & Cloud',
      governance: 'Gouvernance & Conformité',
    },
    proficiency: {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      expert: 'Expert',
    },
    sectionTitle: 'Mes Compétences Cyber',
    sectionDesc: 'Mon expertise technique se structure autour de la sécurité offensive, de la détection d\'intrusions, du scripting d\'outils de sécurité et de l\'administration réseau sécurisée.',
    defensive: {
      title: 'Sécurité Défensive & SOC (Blue Team)',
      description: 'Supervision SIEM d\'infrastructures, analyse de journaux d\'événements, Threat Hunting et réponse aux incidents.',
      skills: {
        siem: 'Supervision SIEM & Règles XML (Wazuh, ELK Stack, Splunk)',
        logs: 'Analyse de logs & Threat Hunting (Syslog, Auth.log, Windows EventViewer)',
        response: 'Réponse aux Incidents & Active Response (Firewall Banning)',
        hardening: 'Durcissement d\'infrastructures (Hardening Linux, Iptables)',
      },
      tags: ['Wazuh SIEM', 'Splunk', 'Threat Hunting', 'Syslog', 'Active Response', 'Hardening', 'DFIR'],
    },
    programming: {
      title: 'Scripting & Automatisation Sécurité',
      description: 'Développement de scripts d\'analyse sur mesure et automatisation de tâches SOC/Défensive.',
      skills: {
        python: 'Scripting d\'outils de sécurité (Python)',
        bash: 'Automatisation système & parseurs de logs (Bash / Regex)',
        git: 'Gestion de version & CI/CD (Git, GitHub)',
        docker: 'Conteneurisation d\'agents (Docker)',
      },
      tags: ['Python', 'Bash', 'Regex Parsers', 'Git', 'Docker', 'Automatisation SOC'],
    },
    systems: {
      title: 'Systèmes & Réseaux Sécurisés',
      description: 'Administration sécurisée de serveurs, filtrage réseau et isolation de services.',
      skills: {
        linux: 'Administration Linux (Debian, Ubuntu, Rocky Linux)',
        network: 'Protocoles réseau & Analyse de paquets (TCP/IP, Wireshark)',
        firewall: 'Configuration Firewalls & Filtrage (Iptables, UFW, VPN)',
        windows: 'Administration Windows Server & Active Directory (Bases)',
      },
      tags: ['Linux Hardening', 'Wireshark', 'TCP/IP', 'Iptables', 'DNS/DHCP', 'VPN'],
    },
    offensive: {
      title: 'Sécurité Offensive & Audit (Red Team)',
      description: 'Compréhension de la mécanique d\'attaque (OWASP, Pentesting) pour renforcer les défenses.',
      skills: {
        scan: 'Scan de vulnérabilités & Reconnaissance (Nmap, Gobuster)',
        audit: 'Audit de protocoles (FTP, SSH, SMB, RDP)',
        web: 'Pentesting Web & Analyse de failles (OWASP Top 10)',
        reverse: 'Compréhension des Exploits & Reverse (Metasploit, Ghidra)',
      },
      tags: ['Nmap', 'Metasploit', 'Burp Suite', 'OWASP', 'Ghidra', 'Wireshark'],
    },
  },

  // Projects Page
  projects: {
    title: 'Projets',
    subtitle: 'Réalisations techniques et recherches',
    categories: {
      all: 'Tous',
      scripting: 'Scripting',
      pentest: 'Pentest',
      defensive: 'Défensif',
      reverse: 'Reverse Engineering',
    },
    status: {
      completed: 'Terminé',
      inProgress: 'En cours',
      planned: 'Planifié',
    },
    details: 'Détails',
    github: 'GitHub',
    demo: 'Démo',
    writeup: 'Write-up',
    sectionTitle: 'Mes Travaux & Projets',
    sectionDesc: 'Une sélection de projets techniques réalisés en laboratoire, simulant des attaques, des audits de sécurité, du reverse engineering et le déploiement d\'architectures SOC.',
    filterAll: 'Tout',
    filterPentest: 'Sécurité Offensive',
    filterDefensive: 'Sécurité Défensive',
    filterScripting: 'Scripting & Autom.',
    filterReverse: 'Reverse Eng.',
    noProjects: 'Aucun projet dans cette catégorie.',
    projectCount: '[{count} projet{count !== 1 ? \'s\' : \'\'}]',
    badgeCompleted: '[RESOLVED]',
    badgeInProgress: '[IN_PROGRESS]',
    modalStatusCompleted: 'STATUS: RESOLVED',
    modalStatusInProgress: 'STATUS: IN_PROGRESS',
    modalDescription: 'Description Générale',
    modalDetails: 'Détails de l\'Implémentation',
    modalTechnologies: 'Technologies Appliquées',
    modalViewSource: 'Consulter le Code Source',
  },

  // Certificates Page
  certificates: {
    title: 'Certifications',
    subtitle: 'Formations validées et reconnaissances',
    issuer: 'Organisme',
    date: 'Date',
    status: 'Statut',
    skills: 'Compétences',
    viewCertificate: 'Voir le certificat',
    verification: 'Vérification',
    sectionTitle: 'Certifications & Formations',
    sectionDesc: 'Une vue d\'ensemble des parcours académiques, des accréditations professionnelles et des cursus spécialisés en cybersécurité validés ou en cours d\'acquisition.',
    certCount: '[{count} certification{count !== 1 ? \'s\' : \'\'}]',
    noCerts: 'Aucune certification enregistrée.',
    badgeVerified: '[VERIFIED: CLEARANCE]',
    badgeInProgress: '[ACQUISITION: IN PROGRESS]',
    verify: 'Vérifier',
  },

  // Contact Page - MERGED: base + extended keys
  contact: {
    title: 'Contact',
    subtitle: 'Discutons de votre projet ou de la cybersécurité',
    form: {
      name: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      sending: 'Envoi...',
      success: 'Message envoyé avec succès !',
      error: 'Erreur lors de l\'envoi du message.',
      required: 'Ce champ est requis.',
      invalidEmail: 'Email invalide.',
      fullNamePlaceholder: 'ex: Jean Dupont',
      emailPlaceholder: 'ex: jean.dupont@sec-agency.com',
      subjectPlaceholder: 'ex: Proposition de collaboration',
      messagePlaceholder: 'Saisissez votre message ici...',
    },
    info: {
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      twitter: 'Twitter',
    },
    intro: 'Vous pouvez me contacter pour discuter d\'un projet, d\'une collaboration, d\'une opportunité professionnelle ou d\'un sujet lié à la cybersécurité.',
    formTitle: 'FORMULAIRE DE CONTACT',
    successTitle: 'MESSAGE ENVOYÉ',
    successMessage: 'Merci pour votre message. Je vous répondrai dans les meilleurs délais.',
    newMessageBtn: 'Nouveau message',
    errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
  },

  // Veille Page - MERGED: base + extended keys
  veille: {
    title: 'Veille Technologique',
    subtitle: 'Articles, recherches et découvertes récentes',
    published: 'Publié',
    readMore: 'Lire la suite',
    source: 'Source',
    date: 'Date',
    noArticles: 'Aucun article pour le moment.',
    sectionTitle: 'Veille Technologique & Cyber-Renseignement',
    sectionDesc: 'Supervision en direct des vulnérabilités exploitées dans le monde (Flux officiel CISA KEV & NIST NVD), analyses d\'incidents et curation des meilleures sources cyber.',
    monitorTitle: 'CYBER_THREAT_INTEL_MONITOR (LIVE_CISA_FEED)',
    monitorRate: 'RATE: ~0.3 EPS',
    liveIngestionActive: '[+] Live Ingestion Active. Interrogation du flux CISA KEV (Known Exploited Vulnerabilities)...',
    tabs: {
      cisa: 'CISA KEV Live',
      sources: 'Sources & Feeds',
    },
    searchPlaceholder: {
      cisa: 'Filtrer par CVE, éditeur, produit...',
      sources: 'Filtrer les sources...',
    },
    refreshTooltip: 'Actualiser le flux CISA',
    loadingCisa: 'Chargement du flux officiel CISA KEV en direct...',
    actionRequired: 'ACTION REQUISE:',
    noCisaResults: 'Aucune alerte CVE ne correspond à votre recherche.',
    noSourceResults: 'Aucune source de veille ne correspond à votre recherche.',
    sourceFrequency: 'IMPACT:',
  },

  // Footer
  footer: {
    copyright: '© {{year}} TinoGreyHat. Tous droits réservés.',
    madeWith: 'Fait avec passion pour la cybersécurité.',
    adminLink: 'Administration',
  },

  // Roadmap - MERGED: base + extended keys for all components
  roadmap: {
    title: 'Roadmap Cybersécurité',
    subtitle: 'Mon parcours de la Licence au poste de RSSI',
    legend: {
      completed: 'Terminé',
      inProgress: 'En cours',
      future: 'À venir',
    },
    progress: 'Progression globale',
    currentLevel: 'Niveau actuel',
    viewDetails: 'Voir les détails',
    locked: 'Niveau verrouillé',
    unlockMessage: 'Terminez les niveaux précédents pour débloquer cette étape.',
    sections: {
      experiences: 'Expériences & Missions',
      certifications: 'Certifications',
      tools: 'Outils & Technologies',
    },
    emptyStates: {
      experiences: 'Aucune expérience renseignée pour ce niveau.',
      certifications: 'Aucune certification renseignée pour ce niveau.',
      tools: 'Aucun outil renseigné pour ce niveau.',
    },
    lockedPreview: {
      experiences: 'Débloquez ce niveau pour voir les expériences.',
      certifications: 'Débloquez ce niveau pour voir les certifications.',
      tools: 'Débloquez ce niveau pour voir les outils.',
    },
    levelLabels: {
      start: 'START',
      goal: 'GOAL',
      level: 'NIVEAU',
    },
    statusLabels: {
      completed: 'Terminé',
      inProgress: 'En cours',
      future: 'À venir',
    },
    // RoadmapPage.jsx specific
    hud: {
      title: 'CAREER ROADMAP',
      subtitle: 'From Cybersecurity to Executive Leadership',
      stats: {
        validated: 'Validés',
        level: 'Niveau',
      },
    },
    zones: {
      zone1: {
        code: 'ZONE 01',
        name: 'TECHNICAL MASTERY',
        desc: 'Construire une expertise opérationnelle : systèmes, réseaux, SOC, détection et réponse à incidents.',
      },
      zone2: {
        code: 'ZONE 02',
        name: 'SECURITY LEADERSHIP',
        desc: 'Passer de l\'expertise individuelle au pilotage du SOC, de la gouvernance et des risques.',
      },
      zone3: {
        code: 'ZONE 03',
        name: 'EXECUTIVE LEADERSHIP',
        desc: 'Étendre son impact à la stratégie, aux finances, aux opérations et à la direction générale.',
      },
    },
    sideQuests: {
      certifications: {
        title: 'SIDE QUEST · CERTIFICATIONS',
        desc: 'Badges complémentaires — selon pertinence et expérience.',
        items: [
          'CCNA 200-301 · CompTIA Security+',
          'Blue Team · SOC / DFIR',
          'ISO/IEC 27001 Lead Implementer',
          'ISO/IEC 27001 Lead Auditor',
          'CISSP · CISM · CRISC · Executive education',
        ],
      },
      academic: {
        title: 'ACADEMIC QUEST · UNIVERSITÉ',
        desc: 'Parcours universitaire parallèle — objectif : doctorat.',
        items: [
          'Licence en cybersécurité',
          'Master 1',
          'Master 2',
          'Doctorat',
        ],
      },
      principle: {
        title: 'CORE PRINCIPLE',
        text: 'Certifications demonstrate knowledge.\nProjects demonstrate skills.\nExperience demonstrates expertise.\nLeadership demonstrates readiness.',
        tagline: 'Apprenez. Progressez. Innovez.',
      },
    },
    legendMap: {
      completed: 'Validé',
      inProgress: 'En cours',
      future: 'Verrouillé',
    },
    // RoadmapDetailPage.jsx specific
    detail: {
      backToRoadmap: 'Retour à la roadmap',
      levelLocked: 'Niveau verrouillé',
      lockedMessage: 'Ce niveau n\'est pas encore accessible. Terminez les niveaux précédents pour débloquer cette étape.',
      errorLoading: 'Erreur de chargement',
      retry: 'Réessayer',
      back: 'Retour',
      sections: {
        experiences: 'Expériences & Missions',
        certifications: 'Certifications',
        tools: 'Outils & Technologies',
      },
      emptyStates: {
        experiences: 'Aucune expérience renseignée pour ce niveau.',
        certifications: 'Aucune certification renseignée pour ce niveau.',
        tools: 'Aucun outil renseigné pour ce niveau.',
      },
      lockedPreviews: {
        experiences: 'Débloquez ce niveau pour voir les expériences.',
        certifications: 'Débloquez ce niveau pour voir les certifications.',
        tools: 'Débloquez ce niveau pour voir les outils.',
      },
      meta: {
        startDate: 'Début',
        endDate: 'Fin',
        futureDates: 'Dates non définies',
      },
      status: {
        completed: 'Terminé',
        inProgress: 'En cours',
        future: 'À venir',
      },
      levelLabels: {
        start: 'START',
        goal: 'GOAL',
        level: 'NIVEAU',
      },
      footerNav: {
        prev: 'Niveau précédent',
        roadmap: 'Roadmap complète',
        next: 'Niveau suivant',
      },
      // Additional keys from second detail block (merged)
      loading: 'Chargement du niveau...',
      error: {
        invalidLevel: 'Niveau invalide',
        loading: 'Erreur de chargement',
      },
      locked: {
        title: 'Niveau verrouillé',
        message: 'Ce niveau n\'est pas encore accessible. Terminez les niveaux précédents pour débloquer cette étape.',
        backToRoadmap: 'Retour à la roadmap',
      },
      backAria: 'Retour à la roadmap',
      backToRoadmapShort: 'Roadmap',
      levelLabel: 'NIVEAU {level}',
      prevAria: 'Niveau précédent',
      nextAria: 'Niveau suivant',
      hero: {
        start: 'START',
        goal: 'GOAL',
        level: 'NIVEAU {level}',
      },
      metaDetailed: {
        startDate: 'Début : {date}',
        endDate: 'Fin : {date}',
        datesUndefined: 'Dates non définies',
      },
      navAria: 'Navigation roadmap',
      nav: {
        prev: 'Niveau précédent',
        fullRoadmap: 'Roadmap complète',
        next: 'Niveau suivant',
      },
    },
    // LevelDetailPanel.jsx specific
    panel: {
      close: 'Fermer le panneau',
      status: {
        completed: 'Validé',
        inProgress: 'En cours',
        future: 'Verrouillé',
      },
      currentBadge: 'Niveau actuel',
      sections: {
        objective: 'Objectif professionnel',
        progress: 'Progression',
        missions: 'Missions',
        skillsTools: 'Compétences & outils',
        certifications: 'Certifications associées',
        conditions: 'Conditions de validation',
      },
      xpReward: '+{xp} XP à la validation',
      emptyStates: {
        missions: 'Aucune mission renseignée.',
        skillsTools: 'Aucun outil renseigné.',
        certifications: 'Aucune certification associée.',
      },
      lockedStates: {
        missions: 'Débloquez ce niveau pour découvrir les missions.',
        skillsTools: 'Débloquez ce niveau pour découvrir les compétences.',
        certifications: 'Débloquez ce niveau pour voir les certifications.',
      },
      conditions: {
        missions: 'Réaliser {count} mission{count !== 1 ? \'s\' : \'\'} du niveau',
        progress: 'Atteindre 100% de progression',
        certifications: 'Obtenir {count} certification{count !== 1 ? \'s\' : \'\'}',
        prerequisites: 'Valider les prérequis des niveaux précédents',
      },
      footer: {
        continue: 'Continuer la progression',
        completed: 'Niveau validé — +{xp} XP acquis',
        locked: 'Terminez les niveaux précédents pour déverrouiller',
        prev: '← Précédent',
        next: 'Suivant →',
      },
    },
    // RoadmapNode.jsx specific
    node: {
      ariaLabel: 'Niveau {level}: {title}, {status}{isCurrent ? \', niveau actuel\' : \'\'}',
      levelLabel: 'LV. {level}',
      tooltip: {
        title: 'LV. {level} — {title}',
        clickToOpen: 'Cliquer pour ouvrir',
      },
    },
  },

  // Admin - MERGED: base + extended keys
  admin: {
    title: 'Administration',
    login: 'Connexion',
    logout: 'Déconnexion',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    dashboard: 'Tableau de bord',
    projects: 'Gestion des projets',
    roadmap: 'Gestion de la roadmap',
    certifications: 'Gestion des certifications',
    skills: 'Gestion des compétences',
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ?',
    loginTitle: 'SECURE ACCESS',
    loginUsername: 'Username',
    loginPassword: 'Password',
    loginBtn: 'LOGIN',
    authenticating: 'AUTHENTICATING...',
    loginError: 'Erreur de connexion',
    dashboardTitle: '[TINOGREYHAT_SYSADMIN]',
    tabs: {
      projects: 'PROJETS',
      certs: 'CERTIFICATIONS',
      roadmap: 'ROADMAP',
    },
    projectsMgmt: {
      title: 'Gestion des Projets',
      addBtn: 'Ajouter',
      table: {
        id: 'ID',
        title: 'Titre',
        category: 'Catégorie',
        actions: 'Actions',
      },
      prompts: {
        title: 'Titre du projet:',
        desc: 'Description:',
      },
    },
    certsMgmt: {
      title: 'Gestion des Certifications',
      addBtn: 'Ajouter',
      table: {
        id: 'ID',
        title: 'Titre',
        issuer: 'Organisme',
        actions: 'Actions',
      },
      prompts: {
        title: 'Titre de la certif:',
        issuer: 'Organisme:',
      },
    },
    roadmapMgmt: {
      title: 'Gestion de la Roadmap',
      table: {
        level: 'Niveau',
        title: 'Titre',
        status: 'Statut',
        locked: 'Verrouillé',
        unlocked: 'Déverrouillé',
        actions: 'Actions',
      },
      bulkActions: {
        unlockAll: 'Tout déverrouiller',
        lockAll: 'Tout verrouiller',
        confirmUnlockAll: 'Êtes-vous sûr de vouloir déverrouiller les 21 niveaux ?',
        confirmLockAll: 'Êtes-vous sûr de vouloir verrouiller les 21 niveaux ?',
      },
      confirmUnlock: 'Déverrouiller ce niveau ?',
      confirmLock: 'Verrouiller ce niveau ?',
      statusLabels: {
        completed: 'Terminé',
        inProgress: 'En cours',
        future: 'À venir',
      },
      loading: 'Chargement de la roadmap...',
      error: 'Erreur de chargement',
      saveSuccess: 'Niveau mis à jour',
      saveError: 'Erreur de mise à jour',
    },
    confirmDeleteProject: 'Supprimer ce projet ?',
    confirmDeleteCert: 'Supprimer cette certification ?',
    prompt: {
      projectTitle: 'Titre du projet:',
      projectDesc: 'Description:',
      certTitle: 'Titre de la certif:',
      certIssuer: 'Organisme:',
    },
    lang: {
      label: 'Langue',
    },
    theme: {
      label: 'Thème',
      dark: 'Sombre',
      light: 'Clair',
      system: 'Système',
    },
  },

  // Data - Veille sources (for dynamic translation)
  veilleData: {
    sources: [
      {
        id: 1,
        title: "The Hacker News",
        description: "La source d'actualité principale pour suivre les cyberattaques majeures, les fuites de données mondiales et les campagnes de logiciels malveillants (malwares) actifs.",
        frequency: "Quotidienne",
        impact: "Haute (Actualités & Campagnes d'attaques)",
        url: "https://thehackernews.com/"
      },
      {
        id: 2,
        title: "KitPloit",
        description: "Une bibliothèque incontournable répertoriant les nouveaux outils de hacking éthique, de pentesting et d'analyse de logiciels malveillants mis en ligne sur GitHub.",
        frequency: "Hebdomadaire",
        impact: "Moyenne-Haute (Outils & Exploitation)",
        url: "https://kitploit.com/"
      },
      {
        id: 3,
        title: "NIST Vulnerability Database (NVD)",
        description: "Base de données nationale des vulnérabilités du gouvernement américain. Idéal pour suivre la publication officielle des CVE et analyser les scores de criticité CVSS v3.",
        frequency: "Quotidienne",
        impact: "Critique (Vulnérabilités & Correctifs)",
        url: "https://nvd.nist.gov/"
      },
      {
        id: 4,
        title: "GitHub Security Trending",
        description: "Surveillance des dépôts GitHub populaires liés à la sécurité informatique. Utile pour identifier les Proof of Concept (PoC) récents et les nouveaux projets de recherche.",
        frequency: "Quotidienne",
        impact: "Moyenne (Veille technique & PoC)",
        url: "https://github.com/trending/security"
      }
    ],
    alerts: [
      { time: "10:02:14", type: "NIST", content: "CVE-2026-0428 - CVSS 9.8 (CRITICAL) - RCE in widely-used web server library.", severity: "critical" },
      { time: "10:01:45", type: "EXPLOIT", content: "GitHub POC released for local privilege escalation in Linux Kernel (CVE-2026-9043).", severity: "high" },
      { time: "10:00:12", type: "NEWS", content: "Active ransomware group targeting European hospital systems with new stealthy payload.", severity: "high" },
      { time: "09:58:33", type: "Wazuh", content: "Rule ID 5715 triggered: Multiple SSH connection attempts failed (Brute Force detected).", severity: "medium" },
      { time: "09:55:01", type: "SYSTEM", content: "Threat intelligence feed from NVD successfully synchronized.", severity: "info" },
      { time: "09:50:24", type: "CVE", content: "CVE-2026-1184 - CVSS 8.4 (HIGH) - Authentication bypass in enterprise router OS.", severity: "high" },
      { time: "09:44:12", type: "GITHUB", content: "New repository 'AutoAudit-Scanner' trending in cybersecurity category (Python / Pentest).", severity: "info" },
      { time: "09:40:00", type: "SOC", content: "SIEM engine status: Operational. Log ingestion rate: 840 events/second.", severity: "info" },
      { time: "09:35:12", type: "EXPLOIT", content: "Metasploit module added for CVE-2025-44910 (Apache Solr Remote Code Execution).", severity: "high" },
      { time: "09:28:44", type: "NEWS", content: "New Android banking trojan 'CerberusV2' bypassing multi-factor authentication.", severity: "critical" }
    ]
  },

  // Errors
  errors: {
    notFound: 'Page non trouvée',
    serverError: 'Erreur serveur',
    unauthorized: 'Non autorisé',
    forbidden: 'Accès interdit',
    tryAgain: 'Réessayer',
    goHome: 'Retour à l\'accueil',
  },
};