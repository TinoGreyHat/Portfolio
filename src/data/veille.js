export const sourcesVeille = [
  {
    id: 1,
    title: "The Hacker News",
    url: "https://thehackernews.com",
    description: "La source d'actualité principale pour suivre les cyberattaques majeures, les fuites de données mondiales et les campagnes de logiciels malveillants (malwares) actifs.",
    frequency: "Quotidienne",
    impact: "Haute (Actualités & Campagnes d'attaques)"
  },
  {
    id: 2,
    title: "KitPloit",
    url: "https://www.kitploit.com",
    description: "Une bibliothèque incontournable répertoriant les nouveaux outils de hacking éthique, de pentesting et d'analyse de logiciels malveillants mis en ligne sur GitHub.",
    frequency: "Hebdomadaire",
    impact: "Moyenne-Haute (Outils & Exploitation)"
  },
  {
    id: 3,
    title: "NIST Vulnerability Database (NVD)",
    url: "https://nvd.nist.gov/vuln",
    description: "Base de données nationale des vulnérabilités du gouvernement américain. Idéal pour suivre la publication officielle des CVE et analyser les scores de criticité CVSS v3.",
    frequency: "Quotidienne",
    impact: "Critique (Vulnérabilités & Correctifs)"
  },
  {
    id: 4,
    title: "GitHub Security Trending",
    url: "https://github.com/trending",
    description: "Surveillance des dépôts GitHub populaires liés à la sécurité informatique. Utile pour identifier les Proof of Concept (PoC) récents et les nouveaux projets de recherche.",
    frequency: "Quotidienne",
    impact: "Moyenne (Veille technique & PoC)"
  }
];

export const simulatedAlerts = [
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
];
