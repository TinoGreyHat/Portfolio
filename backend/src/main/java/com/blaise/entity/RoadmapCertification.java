package com.blaise.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmap_certifications")
@Data
public class RoadmapCertification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String organization;

    @Column(name = "obtained_date")
    private LocalDate obtainedDate;

    @Pattern(regexp = "^(https?://).*$", message = "URL invalide")
    @Column(name = "certificate_url")
    private String certificateUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_level_id", nullable = false)
    private RoadmapLevel roadmapLevel;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}