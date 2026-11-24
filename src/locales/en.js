export default {
  // Navigation
  nav: {
    home: 'Home',
    roadmap: 'Roadmap',
    skills: 'Skills',
    projects: 'Projects',
    certificates: 'Certificates',
    about: 'About',
    experiences: 'Experiences',
    formation: 'Education',
    contact: 'Contact',
    veille: 'Watch',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    viewDetails: 'View details',
    seeMore: 'See more',
    seeLess: 'See less',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    system: 'System',
  },

  // Home Page
  home: {
    title: 'Cybersecurity & Ethical Hacking Portfolio',
    subtitle: 'Cybersecurity & Ethical Hacking Student',
    systemStatus: 'SYSTEM STATUS: OPERATIONAL',
    profileName: 'TETE Kokou Blaise Etiam',
    profileAlias: 'TinoGreyHat',
    bio: 'Passionate about offensive and defensive cybersecurity, I develop tools, perform audits, and share my tech watch. My goal: become a CISO.',
    stats: {
      projects: 'Projects',
      certifications: 'Certifications',
      skills: 'Skills',
      experience: 'Years of experience',
      tryhackme: 'TryHackMe Rank',
      cyberProjects: 'Cyber Projects',
      certificationsShort: 'Certifications',
      languages: 'Favorite Languages',
    },
    cta: {
      viewProjects: 'View projects',
      viewRoadmap: 'View roadmap',
      contactMe: 'Contact me',
      downloadCV: 'Download CV',
    },
    titles: [
      'SOC Analyst & Blue Team Specialist',
      'Threat Hunter & Wazuh SIEM Expert',
      'Incident Detection Specialist & Hardening',
      'Security Engineer & Log Analysis (Syslog/ELK)'
    ],
    badges: [
      '[ROLE: BLUE TEAM / SOC]',
      '[SIEM: WAZUH / SPLUNK]',
      '[HARDENING: LINUX / NET]'
    ],
    social: {
      github: 'GitHub Profile',
      linkedin: 'LinkedIn Profile',
      tryhackme: 'TryHackMe Profile',
    },
  },

  // About Page - MERGED: base + extended keys
  about: {
    title: 'About',
    subtitle: 'My journey and philosophy',
    journey: 'My journey',
    philosophy: 'My philosophy',
    values: {
      curiosity: 'Technical curiosity',
      rigor: 'Methodological rigor',
      sharing: 'Knowledge sharing',
      ethics: 'Hacker ethics',
    },
    education: 'Education',
    experience: 'Experience',
    sectionTitle: 'About Me',
    sectionDesc: 'My journey, professional goals, and research labs.',
    intro1: 'My name is <strong>TETE Kokou Blaise Etiam</strong> (alias <strong>TinoGreyHat</strong>). A passionate defensive security practitioner (Blue Team & SOC), I specialize in SIEM supervision (Wazuh, Splunk), threat hunting (Threat Hunting), log analysis, and system hardening.',
    intro2: 'My philosophy is rooted in <em>proactive vigilance & defense in depth</em>: continuously monitoring flows, correlating weak signals, and automating incident responses (Active Response) to neutralize attacks at the earliest stages of the Kill Chain.',
    highlightQuote: '"Watch the invisible, correlate security events, and immunize infrastructures against emerging threats."',
    timelineTitle: 'Curriculum & Milestones',
    timeline: [
      {
        date: '2023 - 2026',
        title: 'Cybersecurity & Ethical Hacking Specialization',
        desc: 'Advanced curriculum focused on IS security, secure network architecture, code auditing, cryptography, and cyber risk management (NIST / ISO 27001).',
      },
      {
        date: 'December 2024',
        title: 'Google Cybersecurity Professional',
        desc: 'Technical certification validating advanced packet analysis (Wireshark), SIEM detection (Splunk, Chronicle), security Python scripting, and framework compliance.',
      },
      {
        date: 'Early 2025',
        title: 'SOC Labs & Wazuh SIEM Detection',
        desc: 'Designed a Threat Hunting lab. Deployed monitoring agents, wrote custom XML rules for brute-force detection and Active Response countermeasures.',
      },
      {
        date: '2025 - 2026',
        title: 'OffSec PEN-100 & Pentest / SOC Internship',
        desc: 'Active preparation for OSCP foundations (PEN-100) and seeking an internship or apprenticeship in Offensive Security (Pentest) or SOC Analysis.',
      },
    ],
  },

  // Skills Page
  skills: {
    title: 'Skills',
    subtitle: 'Technologies and domains mastered',
    categories: {
      offensive: 'Offensive / Red Team',
      defensive: 'Defensive / Blue Team',
      programming: 'Programming & Scripting',
      infrastructure: 'Infrastructure & Cloud',
      governance: 'Governance & Compliance',
    },
    proficiency: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert',
    },
    sectionTitle: 'My Cyber Skills',
    sectionDesc: 'My technical expertise is structured around offensive security, intrusion detection, security tool scripting, and secure network administration.',
    defensive: {
      title: 'Defensive Security & SOC (Blue Team)',
      description: 'SIEM infrastructure supervision, event log analysis, Threat Hunting and incident response.',
      skills: {
        siem: 'SIEM Supervision & XML Rules (Wazuh, ELK Stack, Splunk)',
        logs: 'Log Analysis & Threat Hunting (Syslog, Auth.log, Windows EventViewer)',
        response: 'Incident Response & Active Response (Firewall Banning)',
        hardening: 'Infrastructure Hardening (Linux Hardening, Iptables)',
      },
      tags: ['Wazuh SIEM', 'Splunk', 'Threat Hunting', 'Syslog', 'Active Response', 'Hardening', 'DFIR'],
    },
    programming: {
      title: 'Scripting & Security Automation',
      description: 'Development of custom analysis scripts and SOC/Defensive task automation.',
      skills: {
        python: 'Security Tool Scripting (Python)',
        bash: 'System Automation & Log Parsers (Bash / Regex)',
        git: 'Version Control & CI/CD (Git, GitHub)',
        docker: 'Agent Containerization (Docker)',
      },
      tags: ['Python', 'Bash', 'Regex Parsers', 'Git', 'Docker', 'SOC Automation'],
    },
    systems: {
      title: 'Secure Systems & Networks',
      description: 'Secure server administration, network filtering and service isolation.',
      skills: {
        linux: 'Linux Administration (Debian, Ubuntu, Rocky Linux)',
        network: 'Network Protocols & Packet Analysis (TCP/IP, Wireshark)',
        firewall: 'Firewall Configuration & Filtering (Iptables, UFW, VPN)',
        windows: 'Windows Server & Active Directory Administration (Basics)',
      },
      tags: ['Linux Hardening', 'Wireshark', 'TCP/IP', 'Iptables', 'DNS/DHCP', 'VPN'],
    },
    offensive: {
      title: 'Offensive Security & Audit (Red Team)',
      description: 'Understanding attack mechanics (OWASP, Pentesting) to strengthen defenses.',
      skills: {
        scan: 'Vulnerability Scanning & Reconnaissance (Nmap, Gobuster)',
        audit: 'Protocol Auditing (FTP, SSH, SMB, RDP)',
        web: 'Web Pentesting & Vulnerability Analysis (OWASP Top 10)',
        reverse: 'Exploit & Reverse Engineering Understanding (Metasploit, Ghidra)',
      },
      tags: ['Nmap', 'Metasploit', 'Burp Suite', 'OWASP', 'Ghidra', 'Wireshark'],
    },
  },

  // Projects Page
  projects: {
    title: 'Projects',
    subtitle: 'Technical achievements and research',
    categories: {
      all: 'All',
      scripting: 'Scripting',
      pentest: 'Pentest',
      defensive: 'Defensive',
      reverse: 'Reverse Engineering',
    },
    status: {
      completed: 'Completed',
      inProgress: 'In progress',
      planned: 'Planned',
    },
    details: 'Details',
    github: 'GitHub',
    demo: 'Demo',
    writeup: 'Write-up',
    sectionTitle: 'My Works & Projects',
    sectionDesc: 'A selection of technical projects completed in lab environments, simulating attacks, security audits, reverse engineering, and SOC architecture deployments.',
    filterAll: 'All',
    filterPentest: 'Offensive Security',
    filterDefensive: 'Defensive Security',
    filterScripting: 'Scripting & Autom.',
    filterReverse: 'Reverse Eng.',
    noProjects: 'No projects in this category.',
    projectCount: '[{count} project{count !== 1 ? \'s\' : \'\'}]',
    badgeCompleted: '[RESOLVED]',
    badgeInProgress: '[IN_PROGRESS]',
    modalStatusCompleted: 'STATUS: RESOLVED',
    modalStatusInProgress: 'STATUS: IN_PROGRESS',
    modalDescription: 'General Description',
    modalDetails: 'Implementation Details',
    modalTechnologies: 'Applied Technologies',
    modalViewSource: 'View Source Code',
  },

  // Certificates Page
  certificates: {
    title: 'Certifications',
    subtitle: 'Validated training and recognitions',
    issuer: 'Issuer',
    date: 'Date',
    status: 'Status',
    skills: 'Skills',
    viewCertificate: 'View certificate',
    verification: 'Verification',
    sectionTitle: 'Certifications & Training',
    sectionDesc: 'An overview of academic paths, professional accreditations, and specialized cybersecurity curricula validated or in progress.',
    certCount: '[{count} certification{count !== 1 ? \'s\' : \'\'}]',
    noCerts: 'No certifications recorded.',
    badgeVerified: '[VERIFIED: CLEARANCE]',
    badgeInProgress: '[ACQUISITION: IN PROGRESS]',
    verify: 'Verify',
  },

  // Contact Page - MERGED: base + extended keys
  contact: {
    title: 'Contact',
    subtitle: 'Let\'s discuss your project or cybersecurity',
    form: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Error sending message.',
      required: 'This field is required.',
      invalidEmail: 'Invalid email.',
      fullNamePlaceholder: 'ex: John Doe',
      emailPlaceholder: 'ex: john.doe@sec-agency.com',
      subjectPlaceholder: 'ex: Collaboration proposal',
      messagePlaceholder: 'Enter your message here...',
    },
    info: {
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      twitter: 'Twitter',
    },
    intro: 'You can contact me to discuss a project, a collaboration, a professional opportunity or a cybersecurity topic.',
    formTitle: 'CONTACT FORM',
    successTitle: 'MESSAGE SENT',
    successMessage: 'Thank you for your message. I will get back to you as soon as possible.',
    newMessageBtn: 'New message',
    errorMessage: 'An error occurred. Please try again.',
  },

  // Veille Page - MERGED: base + extended keys
  veille: {
    title: 'Tech Watch',
    subtitle: 'Recent articles, research and discoveries',
    published: 'Published',
    readMore: 'Read more',
    source: 'Source',
    date: 'Date',
    noArticles: 'No articles at the moment.',
    sectionTitle: 'Tech Watch & Cyber Intelligence',
    sectionDesc: 'Live monitoring of exploited vulnerabilities worldwide (Official CISA KEV Feed & NIST NVD), incident analyses and curation of the best cyber sources.',
    monitorTitle: 'CYBER_THREAT_INTEL_MONITOR (LIVE_CISA_FEED)',
    monitorRate: 'RATE: ~0.3 EPS',
    liveIngestionActive: '[+] Live Ingestion Active. Querying CISA KEV feed (Known Exploited Vulnerabilities)...',
    tabs: {
      cisa: 'CISA KEV Live',
      sources: 'Sources & Feeds',
    },
    searchPlaceholder: {
      cisa: 'Filter by CVE, vendor, product...',
      sources: 'Filter sources...',
    },
    refreshTooltip: 'Refresh CISA feed',
    loadingCisa: 'Loading official CISA KEV live feed...',
    actionRequired: 'ACTION REQUIRED:',
    noCisaResults: 'No CVE alert matches your search.',
    noSourceResults: 'No watch source matches your search.',
    sourceFrequency: 'IMPACT:',
  },

  // Footer
  footer: {
    copyright: '© {{year}} TinoGreyHat. All rights reserved.',
    madeWith: 'Made with passion for cybersecurity.',
    adminLink: 'Administration',
  },

  // Roadmap - MERGED: base + extended keys for all components
  roadmap: {
    title: 'Cybersecurity Roadmap',
    subtitle: 'My journey from Bachelor\'s degree to CISO position',
    legend: {
      completed: 'Completed',
      inProgress: 'In progress',
      future: 'Future',
    },
    progress: 'Overall progress',
    currentLevel: 'Current level',
    viewDetails: 'View details',
    locked: 'Level locked',
    unlockMessage: 'Complete previous levels to unlock this step.',
    sections: {
      experiences: 'Experiences & Missions',
      certifications: 'Certifications',
      tools: 'Tools & Technologies',
    },
    emptyStates: {
      experiences: 'No experience listed for this level.',
      certifications: 'No certification listed for this level.',
      tools: 'No tools listed for this level.',
    },
    lockedPreview: {
      experiences: 'Unlock this level to see experiences.',
      certifications: 'Unlock this level to see certifications.',
      tools: 'Unlock this level to see tools.',
    },
    levelLabels: {
      start: 'START',
      goal: 'GOAL',
      level: 'LEVEL',
    },
    statusLabels: {
      completed: 'Completed',
      inProgress: 'In progress',
      future: 'Future',
    },
    // RoadmapPage.jsx specific
    hud: {
      title: 'CAREER ROADMAP',
      subtitle: 'From Cybersecurity to Executive Leadership',
      stats: {
        validated: 'Completed',
        level: 'Level',
      },
    },
    zones: {
      zone1: {
        code: 'ZONE 01',
        name: 'TECHNICAL MASTERY',
        desc: 'Build operational expertise: systems, networks, SOC, detection and incident response.',
      },
      zone2: {
        code: 'ZONE 02',
        name: 'SECURITY LEADERSHIP',
        desc: 'Transition from individual expertise to SOC management, governance and risk.',
      },
      zone3: {
        code: 'ZONE 03',
        name: 'EXECUTIVE LEADERSHIP',
        desc: 'Extend impact to strategy, finance, operations and general management.',
      },
    },
    sideQuests: {
      certifications: {
        title: 'SIDE QUEST · CERTIFICATIONS',
        desc: 'Complementary badges — based on relevance and experience.',
        items: [
          'CCNA 200-301 · CompTIA Security+',
          'Blue Team · SOC / DFIR',
          'ISO/IEC 27001 Lead Implementer',
          'ISO/IEC 27001 Lead Auditor',
          'CISSP · CISM · CRISC · Executive education',
        ],
      },
      academic: {
        title: 'ACADEMIC QUEST · UNIVERSITY',
        desc: 'Parallel university path — goal: doctorate.',
        items: [
          'Bachelor in Cybersecurity',
          'Master 1',
          'Master 2',
          'Doctorate',
        ],
      },
      principle: {
        title: 'CORE PRINCIPLE',
        text: 'Certifications demonstrate knowledge.\nProjects demonstrate skills.\nExperience demonstrates expertise.\nLeadership demonstrates readiness.',
        tagline: 'Learn. Progress. Innovate.',
      },
    },
    legendMap: {
      completed: 'Completed',
      inProgress: 'In progress',
      future: 'Locked',
    },
    // RoadmapDetailPage.jsx specific
    detail: {
      backToRoadmap: 'Back to roadmap',
      levelLocked: 'Level Locked',
      lockedMessage: 'This level is not yet accessible. Complete previous levels to unlock this step.',
      errorLoading: 'Loading Error',
      retry: 'Retry',
      back: 'Back',
      sections: {
        experiences: 'Experiences & Missions',
        certifications: 'Certifications',
        tools: 'Tools & Technologies',
      },
      emptyStates: {
        experiences: 'No experience listed for this level.',
        certifications: 'No certification listed for this level.',
        tools: 'No tools listed for this level.',
      },
      lockedPreviews: {
        experiences: 'Unlock this level to see experiences.',
        certifications: 'Unlock this level to see certifications.',
        tools: 'Unlock this level to see tools.',
      },
      meta: {
        startDate: 'Start',
        endDate: 'End',
        futureDates: 'Dates not defined',
      },
      status: {
        completed: 'Completed',
        inProgress: 'In progress',
        future: 'Future',
      },
      levelLabels: {
        start: 'START',
        goal: 'GOAL',
        level: 'LEVEL',
      },
      footerNav: {
        prev: 'Previous Level',
        roadmap: 'Full Roadmap',
        next: 'Next Level',
      },
      // Additional keys from second detail block (merged)
      loading: 'Loading level...',
      error: {
        invalidLevel: 'Invalid level',
        loading: 'Loading Error',
      },
      locked: {
        title: 'Level Locked',
        message: 'This level is not yet accessible. Complete previous levels to unlock this step.',
        backToRoadmap: 'Back to roadmap',
      },
      backAria: 'Back to roadmap',
      backToRoadmapShort: 'Roadmap',
      levelLabel: 'LEVEL {level}',
      prevAria: 'Previous Level',
      nextAria: 'Next Level',
      hero: {
        start: 'START',
        goal: 'GOAL',
        level: 'LEVEL {level}',
      },
      metaDetailed: {
        startDate: 'Start: {date}',
        endDate: 'End: {date}',
        datesUndefined: 'Dates not defined',
      },
      navAria: 'Roadmap navigation',
      nav: {
        prev: 'Previous Level',
        fullRoadmap: 'Full Roadmap',
        next: 'Next Level',
      },
    },
    // LevelDetailPanel.jsx specific
    panel: {
      close: 'Close panel',
      status: {
        completed: 'Completed',
        inProgress: 'In progress',
        future: 'Locked',
      },
      currentBadge: 'Current Level',
      sections: {
        objective: 'Professional Objective',
        progress: 'Progress',
        missions: 'Missions',
        skillsTools: 'Skills & Tools',
        certifications: 'Associated Certifications',
        conditions: 'Validation Conditions',
      },
      xpReward: '+{xp} XP on validation',
      emptyStates: {
        missions: 'No mission listed.',
        skillsTools: 'No tool listed.',
        certifications: 'No associated certification.',
      },
      lockedStates: {
        missions: 'Unlock this level to discover missions.',
        skillsTools: 'Unlock this level to discover skills.',
        certifications: 'Unlock this level to see certifications.',
      },
      conditions: {
        missions: 'Complete {count} mission{count !== 1 ? \'s\' : \'\'} of the level',
        progress: 'Reach 100% progress',
        certifications: 'Obtain {count} certification{count !== 1 ? \'s\' : \'\'}',
        prerequisites: 'Validate prerequisites of previous levels',
      },
      footer: {
        continue: 'Continue Progression',
        completed: 'Level completed — +{xp} XP earned',
        locked: 'Complete previous levels to unlock',
        prev: '← Previous',
        next: 'Next →',
      },
    },
    // RoadmapNode.jsx specific
    node: {
      ariaLabel: 'Level {level}: {title}, {status}{isCurrent ? \', current level\' : \'\'}',
      levelLabel: 'LV. {level}',
      tooltip: {
        title: 'LV. {level} — {title}',
        clickToOpen: 'Click to open',
      },
    },
  },

  // Admin - MERGED: base + extended keys
  admin: {
    title: 'Administration',
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    dashboard: 'Dashboard',
    projects: 'Projects management',
    roadmap: 'Roadmap management',
    certifications: 'Certifications management',
    skills: 'Skills management',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete?',
    loginTitle: 'SECURE ACCESS',
    loginUsername: 'Username',
    loginPassword: 'Password',
    loginBtn: 'LOGIN',
    authenticating: 'AUTHENTICATING...',
    loginError: 'Login error',
    dashboardTitle: '[TINOGREYHAT_SYSADMIN]',
    tabs: {
      projects: 'PROJECTS',
      certs: 'CERTIFICATIONS',
      roadmap: 'ROADMAP',
    },
    projectsMgmt: {
      title: 'Projects Management',
      addBtn: 'Add',
      table: {
        id: 'ID',
        title: 'Title',
        category: 'Category',
        actions: 'Actions',
      },
      prompts: {
        title: 'Project title:',
        desc: 'Description:',
      },
    },
    certsMgmt: {
      title: 'Certifications Management',
      addBtn: 'Add',
      table: {
        id: 'ID',
        title: 'Title',
        issuer: 'Issuer',
        actions: 'Actions',
      },
      prompts: {
        title: 'Certification title:',
        issuer: 'Issuer:',
      },
    },
    roadmapMgmt: {
      title: 'Roadmap Management',
      table: {
        level: 'Level',
        title: 'Title',
        status: 'Status',
        locked: 'Locked',
        unlocked: 'Unlocked',
        actions: 'Actions',
      },
      bulkActions: {
        unlockAll: 'Unlock All',
        lockAll: 'Lock All',
        confirmUnlockAll: 'Are you sure you want to unlock all 21 levels?',
        confirmLockAll: 'Are you sure you want to lock all 21 levels?',
      },
      confirmUnlock: 'Unlock this level?',
      confirmLock: 'Lock this level?',
      statusLabels: {
        completed: 'Completed',
        inProgress: 'In progress',
        future: 'Future',
      },
      loading: 'Loading roadmap...',
      error: 'Loading error',
      saveSuccess: 'Level updated',
      saveError: 'Update error',
    },
    confirmDeleteProject: 'Delete this project?',
    confirmDeleteCert: 'Delete this certification?',
    prompt: {
      projectTitle: 'Project title:',
      projectDesc: 'Description:',
      certTitle: 'Certification title:',
      certIssuer: 'Issuer:',
    },
    lang: {
      label: 'Language',
    },
    theme: {
      label: 'Theme',
      dark: 'Dark',
      light: 'Light',
      system: 'System',
    },
  },

  // Data - Veille sources (for dynamic translation)
  veilleData: {
    sources: [
      {
        id: 1,
        title: "The Hacker News",
        description: "The main news source to track major cyberattacks, global data breaches and active malware campaigns.",
        frequency: "Daily",
        impact: "High (News & Attack Campaigns)",
        url: "https://thehackernews.com/"
      },
      {
        id: 2,
        title: "KitPloit",
        description: "An essential library listing new ethical hacking, pentesting and malware analysis tools published on GitHub.",
        frequency: "Weekly",
        impact: "Medium-High (Tools & Exploitation)",
        url: "https://kitploit.com/"
      },
      {
        id: 3,
        title: "NIST Vulnerability Database (NVD)",
        description: "US Government national vulnerability database. Ideal for tracking official CVE publications and analyzing CVSS v3 severity scores.",
        frequency: "Daily",
        impact: "Critical (Vulnerabilities & Patches)",
        url: "https://nvd.nist.gov/"
      },
      {
        id: 4,
        title: "GitHub Security Trending",
        description: "Monitoring popular GitHub repositories related to cybersecurity. Useful for identifying recent Proof of Concept (PoC) and new research projects.",
        frequency: "Daily",
        impact: "Medium (Tech Watch & PoC)",
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
    notFound: 'Page not found',
    serverError: 'Server error',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    tryAgain: 'Try again',
    goHome: 'Go home',
  },
};