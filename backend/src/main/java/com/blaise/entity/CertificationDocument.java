package com.blaise.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "certification_documents")
@Data
public class CertificationDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    @Column(nullable = false)
    private String fileName; // Original file name

    @Column(nullable = false)
    private String storedFileName; // Stored file name (UUID + extension)

    @Column(nullable = false)
    private String contentType; // MIME type (application/pdf)

    @Column(name = "file_size", nullable = false)
    private Long fileSize; // File size in bytes

    @Column(name = "file_path", nullable = false)
    private String filePath; // Relative path to file on server

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true; // Whether the document is accessible publicly

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}