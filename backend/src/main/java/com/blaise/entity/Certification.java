package com.blaise.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "certifications")
@Data
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String issuer;
    private String date;
    private String status;
    private String credentialId;
    private String verificationLink;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "certification_skills", joinColumns = @JoinColumn(name = "certification_id"))
    @Column(name = "skill")
    private List<String> skills;

    private String badge;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
