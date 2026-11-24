package com.blaise.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "certifications")
@Data
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String acronym; // Sigle/acronyme

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "issuer_id")
    private CertificationIssuer issuer;

    private String category; // Category/type of certification

    private String certificationType; // Type: "PROFESSIONAL", "ACADEMIC", "VENDOR", etc.

    @Column(columnDefinition = "TEXT")
    private String shortDescription; // Description courte

    @Column(name = "start_date")
    private String startDate; // Date de début

    @Column(name = "obtained_date")
    private String obtainedDate; // Date d'obtention (main date field)

    @Column(name = "expiry_date")
    private String expiryDate; // Date d'expiration

    private String credentialId; // Identifiant de certification

    private String status; // VERIFIED, IN_PROGRESS, PENDING

    private String mention; // Mention complémentaire (ex: SECURITY CLEARANCE)

    private String verificationLink; // Lien officiel de vérification

    private String logo; // Logo/image URL

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false)
    private PublicationStatus publicationStatus = PublicationStatus.DRAFT;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible = true;

    @JsonManagedReference
    @OneToMany(mappedBy = "certification", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @BatchSize(size = 10)
    private List<CertificationSkill> skills = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "certification", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @BatchSize(size = 10)
    private List<CertificationDetail> details = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "certification", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    private List<CertificationDocument> documents = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum PublicationStatus {
        DRAFT, PUBLISHED, UNPUBLISHED
    }
}