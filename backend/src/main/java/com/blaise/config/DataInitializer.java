package com.blaise.config;

import com.blaise.entity.User;
import com.blaise.entity.Project;
import com.blaise.entity.Certification;
import com.blaise.repository.UserRepository;
import com.blaise.repository.ProjectRepository;
import com.blaise.repository.CertificationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository, ProjectRepository projectRepository, CertificationRepository certificationRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.certificationRepository = certificationRepository;
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
    }
}
