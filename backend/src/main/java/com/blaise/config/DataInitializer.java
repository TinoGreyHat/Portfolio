package com.blaise.config;

import com.blaise.entity.RoadmapCertification;
import com.blaise.entity.RoadmapExperience;
import com.blaise.entity.RoadmapLevel;
import com.blaise.entity.RoadmapTool;
import com.blaise.entity.User;
import com.blaise.entity.Project;
import com.blaise.entity.Certification;
import com.blaise.repository.RoadmapCertificationRepository;
import com.blaise.repository.RoadmapExperienceRepository;
import com.blaise.repository.RoadmapLevelRepository;
import com.blaise.repository.RoadmapToolRepository;
import com.blaise.repository.UserRepository;
import com.blaise.repository.ProjectRepository;
import com.blaise.repository.CertificationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    private final RoadmapLevelRepository roadmapLevelRepository;
    private final RoadmapExperienceRepository roadmapExperienceRepository;
    private final RoadmapCertificationRepository roadmapCertificationRepository;
    private final RoadmapToolRepository roadmapToolRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository,
                            ProjectRepository projectRepository,
                            CertificationRepository certificationRepository,
                            RoadmapLevelRepository roadmapLevelRepository,
                            RoadmapExperienceRepository roadmapExperienceRepository,
                            RoadmapCertificationRepository roadmapCertificationRepository,
                            RoadmapToolRepository roadmapToolRepository,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.certificationRepository = certificationRepository;
        this.roadmapLevelRepository = roadmapLevelRepository;
        this.roadmapExperienceRepository = roadmapExperienceRepository;
        this.roadmapCertificationRepository = roadmapCertificationRepository;
        this.roadmapToolRepository = roadmapToolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Admin user created successfully.");
        }

        if (projectRepository.count() == 0) {
            Project p1 = new Project();
            p1.setTitle("Scanner de Ports Multi-threadé & Banner Grabber");
            p1.setCategory("scripting");
            p1.setStatus("COMPLETED");
            p1.setDate("Janvier 2025");
            p1.setTags(Arrays.asList("Python", "Sockets", "Threading", "Reconnaissance"));
            p1.setDescription("Tooling Offensif : Outil de reconnaissance réseau hautes performances en Python exploitant le multi-threading et le Banner Grabbing automatisé.");
            p1.setDetails("Développement d'un scanner de ports custom pour accélérer la phase de recon (reconnaissance) lors d'un audit de sécurité. En exploitant la programmation asynchrone/multi-threadée en Python, l'outil scanne des plages de ports IP en quelques secondes. Il extrait automatiquement les bannières réseau des services (SSH, FTP, HTTP) pour croiser les versions identifiées avec la base de données de failles connues (CVE).");
            p1.setGithubLink("https://github.com/TinoGreyHat/port-scanner-python");
            projectRepository.save(p1);

            Project p2 = new Project();
            p2.setTitle("Exploitation Controlled vsftpd & Hardening System");
            p2.setCategory("pentest");
            p2.setStatus("COMPLETED");
            p2.setDate("Février 2025");
            p2.setTags(Arrays.asList("Pentesting", "Metasploit", "Root Shell", "Hardening"));
            p2.setDescription("Simulation Red/Blue Team : Du Remote Shell Root (backdoor vsftpd 2.3.4) jusqu'au durcissement système et à l'isolation réseau via iptables.");
            p2.setDetails("Démonstration complète de la chaîne d'attaque et de la remédiation. Phase Red Team : Scan de vulnérabilités Nmap, exploitation de la porte dérobée historique vsftpd 2.3.4 via Metasploit et obtention d'un accès Root interactif. Phase Blue Team : Application du correctif, désactivation des accès anonymes, chroot des utilisateurs FTP et déploiement de règles Iptables strictes pour filtrer l'accès au service.");
            p2.setGithubLink("https://github.com/TinoGreyHat/ftp-exploitation-hardening");
            projectRepository.save(p2);

            Project p3 = new Project();
            p3.setTitle("Architecture SOC & Détection d'Attaques Wazuh SIEM");
            p3.setCategory("defensive");
            p3.setStatus("COMPLETED");
            p3.setDate("Mars 2025");
            p3.setTags(Arrays.asList("SIEM", "Wazuh", "Threat Hunting", "Active Response"));
            p3.setDescription("Supervision & Threat Hunting : Déploiement d'un agent Wazuh SIEM, écriture de règles XML sur-mesure et réponse automatisée (Active Response).");
            p3.setDetails("Mise en place d'un SOC de laboratoire pour la détection proactive des menaces. Déploiement d'agents de supervision sur cibles Linux. Écriture de décodeurs et de règles d'alerte XML personnalisées pour analyser /var/log/auth.log et intercepter les attaques par dictionnaire/force brute SSH. Configuration d'un script d'Active Response pour bannir automatiquement les IP attaquantes au niveau du pare-feu dès le franchissement de seuil d'alerte.");
            p3.setGithubLink("https://github.com/TinoGreyHat/wazuh-siem-dashboard");
            projectRepository.save(p3);

            Project p4 = new Project();
            p4.setTitle("Reverse Engineering d'un Binaire Obfusqué en C");
            p4.setCategory("reverse");
            p4.setStatus("IN_PROGRESS");
            p4.setDate("Avril 2025");
            p4.setTags(Arrays.asList("Ghidra", "x64dbg", "Assembleur x86", "Reverse Engineering"));
            p4.setDescription("Analyse Malware & Reverse : Rétro-ingénierie statique et dynamique sous Ghidra & x64dbg pour décompiler la logique de licence et extraire le secret.");
            p4.setDetails("Analyse binaire approfondie. Phase Statique : Décompilation de l'exécutable C avec Ghidra pour reconstituer le graphe de contrôle de flux et isoler les fonctions de validation de mot de passe. Phase Dynamique : Exécution contrôlée sous debugger x64dbg avec pose de breakpoints sur les registres EAX/RAX et inspection de la mémoire stack pour extraire la clé de licence en clair.");
            p4.setGithubLink("https://github.com/TinoGreyHat/reverse-engineering-crackme");
            projectRepository.save(p4);

            System.out.println("Projects seeded successfully.");
        }

        if (certificationRepository.count() == 0) {
            Certification c1 = new Certification();
            c1.setTitle("eJPT - Junior Penetration Tester");
            c1.setIssuer("INE / eLearnSecurity");
            c1.setDate("Avril 2024");
            c1.setStatus("COMPLETED");
            c1.setSkills(Arrays.asList("Host & Network Pentesting", "Web App Pentesting", "Vulnerability Assessment", "Metasploit"));
            certificationRepository.save(c1);

            Certification c2 = new Certification();
            c2.setTitle("PICC - Cyber Security Analyst");
            c2.setIssuer("Google / Coursera");
            c2.setDate("Décembre 2024");
            c2.setStatus("COMPLETED");
            c2.setSkills(Arrays.asList("SIEM", "Incident Response", "Linux/SQL", "Python Scripting"));
            certificationRepository.save(c2);
            
            System.out.println("Certifications seeded successfully.");
        }

        // Initialize Roadmap Levels (7 fixed levels)
        if (roadmapLevelRepository.count() == 0) {
            initRoadmapLevels();
        }
    }

    private void initRoadmapLevels() {
        // ============================================================
        // ZONE 01 — TECHNICAL MASTERY (Niveaux 00 à 07)
        // ============================================================
        RoadmapLevel level0 = createLevel(0, "Licence en cybersécurité",
                RoadmapLevel.LevelStatus.COMPLETED,
                LocalDate.of(2022, 9, 1), LocalDate.of(2025, 6, 30),
                "Point de départ du parcours. Acquisition des fondamentaux en sécurité informatique, réseaux, systèmes d'exploitation et programmation. Base académique solide pour évoluer vers des fonctions opérationnelles.", 100);

        RoadmapLevel level1 = createLevel(1, "SOC Analyst L1",
                RoadmapLevel.LevelStatus.IN_PROGRESS,
                LocalDate.of(2025, 9, 1), null,
                "Première ligne de défense du SOC. Surveillance des événements de sécurité, triage et qualification des alertes, escalade vers les niveaux supérieurs.", 0);

        RoadmapLevel level2 = createLevel(2, "SOC Analyst L1 confirmé",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Consolidation des compétences de surveillance. Maîtrise des outils SIEM, procédures de triage et premières investigations autonomes sur alertes de faible criticité.", 0);

        RoadmapLevel level3 = createLevel(3, "SOC Analyst L2",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Investigation approfondie des incidents. Analyse des menaces, corrélation d'événements, qualification des attaques et proposition de mesures de remédiation.", 0);

        RoadmapLevel level4 = createLevel(4, "SOC Analyst L2 confirmé",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Expertise opérationnelle confirmée sur l'analyse d'incidents. Gestion de cas complexes, analyse forensique basique et amélioration des règles de détection.", 0);

        RoadmapLevel level5 = createLevel(5, "Senior SOC Analyst",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Analyste senior référent. Mentorat des analystes juniors, traitement des incidents majeurs, contribution à l'amélioration des processus de détection et de réponse.", 0);

        RoadmapLevel level6 = createLevel(6, "Threat Hunter / Detection Engineer",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Recherche proactive de menaces (Threat Hunting) et ingénierie de la détection. Création de règles, playbooks et contenus de détection pour anticiper les attaques.", 0);

        RoadmapLevel level7 = createLevel(7, "SOC Technical Lead",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Référent technique du SOC. Pilotage de l'architecture de supervision, choix des outils, intégration des solutions de détection et encadrement technique de l'équipe.", 0);

        // ============================================================
        // ZONE 02 — SECURITY LEADERSHIP (Niveaux 08 à 15)
        // ============================================================
        RoadmapLevel level8 = createLevel(8, "SOC Manager",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Management opérationnel du SOC. Planification, pilotage de l'activité, gestion des ressources et reporting vers la direction.", 0);

        RoadmapLevel level9 = createLevel(9, "SOC Manager confirmé",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Management confirmé du centre de supervision. Optimisation des processus, gestion des prestataires, amélioration continue de la qualité de service.", 0);

        RoadmapLevel level10 = createLevel(10, "ISO 27001 Lead Implementer",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Pilotage de la mise en place d'un SMSI conforme ISO/IEC 27001. Analyse de risques, mise en œuvre des contrôles et accompagnement vers la certification.", 0);

        RoadmapLevel level11 = createLevel(11, "ISO 27001 Lead Auditor",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Réalisation d'audits ISO/IEC 27001 internes et externes. Évaluation de la conformité du SMSI, identification des écarts et proposition de plans d'action.", 0);

        RoadmapLevel level12 = createLevel(12, "Cybersecurity Governance Manager",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Déploiement de la gouvernance de la sécurité de l'information. Politiques, standards, gestion des risques et conformité réglementaire (RGPD, NIS2, etc.).", 0);

        RoadmapLevel level13 = createLevel(13, "Head of Cybersecurity",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Direction de la fonction cybersécurité. Définition de la stratégie, pilotage budgétaire, coordination des équipes sécurité et représentation auprès du comité de direction.", 0);

        RoadmapLevel level14 = createLevel(14, "Deputy CISO",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Adjoint au RSSI. Appui à la définition et au déploiement de la stratégie de sécurité, gestion opérationnelle transverse et représentation du RSSI auprès des instances.", 0);

        RoadmapLevel level15 = createLevel(15, "RSSI / CISO",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Responsable de la sécurité des systèmes d'information. Pilotage global de la cybersécurité de l'organisation, gouvernance, gestion des risques et conformité.", 0);

        // ============================================================
        // ZONE 03 — EXECUTIVE LEADERSHIP (Niveaux 16 à 20)
        // ============================================================
        RoadmapLevel level16 = createLevel(16, "CISO confirmé",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "RSSI confirmé à la tête d'organisations complexes. Gestion de programmes de sécurité à grande échelle, transformation de la posture de sécurité et reporting au COMEX.", 0);

        RoadmapLevel level17 = createLevel(17, "Strategic Security Executive",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Cadre dirigeant stratégique. Contribution à la stratégie globale de l'entreprise, alignement de la sécurité sur les objectifs métiers et gouvernance élargie.", 0);

        RoadmapLevel level18 = createLevel(18, "Executive Management",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Intégration du cercle de direction élargie. Pilotage transverse de plusieurs fonctions incluant la sécurité, les risques et la conformité.", 0);

        RoadmapLevel level19 = createLevel(19, "Direction générale",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Responsabilité de la direction générale ou d'une business unit. Stratégie globale, performance financière, gouvernance d'entreprise et leadership organisationnel.", 0);

        RoadmapLevel level20 = createLevel(20, "CEO / Chief Executive Officer",
                RoadmapLevel.LevelStatus.FUTURE,
                null, null,
                "Direction générale de l'organisation. Définition de la vision, de la stratégie et de la culture d'entreprise, responsabilité finale de la performance et de la sécurité.", 0);

        roadmapLevelRepository.saveAll(Arrays.asList(
                level0, level1, level2, level3, level4, level5, level6, level7,
                level8, level9, level10, level11, level12, level13, level14, level15,
                level16, level17, level18, level19, level20
        ));
        System.out.println("Roadmap levels seeded successfully (21 levels).");
    }

    private RoadmapLevel createLevel(int levelNumber, String title, RoadmapLevel.LevelStatus status,
                                      LocalDate startDate, LocalDate endDate, String summary, Integer progress) {
        RoadmapLevel level = new RoadmapLevel();
        level.setLevelNumber(levelNumber);
        level.setTitle(title);
        level.setStatus(status);
        level.setStartDate(startDate);
        level.setEndDate(endDate);
        level.setSummary(summary);
        level.setProgress(progress != null ? progress : 0);
        return level;
    }
}
