/**
 * Service API Cybersécurité - Extraction du flux CISA KEV (Known Exploited Vulnerabilities)
 * et renseignement sur les menaces en temps réel.
 */

const CISA_KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

// Fallback d'urgence avec de vraies CVEs récentes au cas où CISA est inaccessible
const FALLBACK_CVES = [
  {
    cveID: 'CVE-2024-30080',
    vendorProject: 'Microsoft',
    product: 'Windows Kernel',
    vulnerabilityName: 'Windows Kernel Elevation of Privilege Vulnerability',
    dateAdded: '2024-06-11',
    shortDescription: 'Une vulnérabilité d\'élévation de privilèges existe dans le noyau Microsoft Windows permettant à un attaquant local d\'obtenir des privilèges SYSTEM.',
    requiredAction: 'Appliquer les mises à jour de sécurité publiées par Microsoft.',
    severity: 'HIGH'
  },
  {
    cveID: 'CVE-2024-21626',
    vendorProject: 'runC',
    product: 'runC Container Runtime',
    vulnerabilityName: 'runC Container Breakout Vulnerability (Leaky Vessels)',
    dateAdded: '2024-01-31',
    shortDescription: 'Une fuite de descripteur de fichier dans runC permet à un conteneur malveillant de s\'échapper et d\'accéder au système hôte.',
    requiredAction: 'Mettre à jour runC vers la version 1.1.12 ou supérieure.',
    severity: 'CRITICAL'
  },
  {
    cveID: 'CVE-2024-1709',
    vendorProject: 'ConnectWise',
    product: 'ScreenConnect',
    vulnerabilityName: 'ConnectWise ScreenConnect Authentication Bypass Vulnerability',
    dateAdded: '2024-02-22',
    shortDescription: 'Contournement d\'authentification permettant à un attaquant à distance non authentifié de créer un compte administrateur sur le serveur.',
    requiredAction: 'Mettre à jour ConnectWise ScreenConnect vers la version 23.9.8 ou ultérieure.',
    severity: 'CRITICAL'
  },
  {
    cveID: 'CVE-2023-48795',
    vendorProject: 'SSH Protocol',
    product: 'SSH Implementation (Terrapin Attack)',
    vulnerabilityName: 'SSH Prefix Truncation Vulnerability (Terrapin)',
    dateAdded: '2023-12-18',
    shortDescription: 'Attaque par tronquage de préfixe affectant le protocole SSH lors de la négociation d\'algorithmes de chiffrement ChaCha20-Poly1305 ou CBC.',
    requiredAction: 'Désactiver les algorithmes vulnérables ou activer l\'extension strict KEX.',
    severity: 'MEDIUM'
  }
];

export async function fetchLiveCISAAlerts() {
  try {
    const response = await fetch(CISA_KEV_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    if (data && Array.isArray(data.vulnerabilities) && data.vulnerabilities.length > 0) {
      // Formater et retourner les 25 vulnérabilités les plus récentes
      return data.vulnerabilities.slice(0, 25).map((item) => ({
        cveID: item.cveID || 'CVE-UNKNOWN',
        vendorProject: item.vendorProject || 'Inconnu',
        product: item.product || 'Produit Spécifique',
        vulnerabilityName: item.vulnerabilityName || item.shortDescription || 'Vulnérabilité Exploité',
        dateAdded: item.dateAdded || new Date().toISOString().split('T')[0],
        shortDescription: item.shortDescription || 'Aucune description disponible.',
        requiredAction: item.requiredAction || 'Appliquer immédiatement les correctifs du fournisseur.',
        severity: item.vulnerabilityName?.toLowerCase().includes('remote code execution') || item.shortDescription?.toLowerCase().includes('remote code')
          ? 'CRITICAL'
          : 'HIGH'
      }));
    }
  } catch (error) {
    console.warn('[cveApi] Impossible d\'atteindre l\'API CISA en direct, utilisation des données d\'urgence:', error);
  }
  return FALLBACK_CVES;
}

export function getNvdUrl(cveID) {
  return `https://nvd.nist.gov/vuln/detail/${encodeURIComponent(cveID)}`;
}
