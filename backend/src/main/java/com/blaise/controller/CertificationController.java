package com.blaise.controller;

import com.blaise.dto.CertificationSummary;
import com.blaise.entity.Certification;
import com.blaise.service.CertificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    private final CertificationService service;

    public CertificationController(CertificationService service) {
        this.service = service;
    }

    // Public endpoint - only published and visible certifications
    @GetMapping
    public List<CertificationSummary> getAll() {
        return service.findAllPublished();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certification> getById(@PathVariable Long id) {
        Certification cert = service.findById(id);
        if (cert.getPublicationStatus() != Certification.PublicationStatus.PUBLISHED || !cert.getIsVisible()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cert);
    }

    // Public endpoint - single certification with all related data (skills, details, documents)
    @GetMapping("/{id}/details")
    public ResponseEntity<Certification> getWithDetails(@PathVariable Long id) {
        Optional<Certification> certOpt = service.findPublishedWithDetailsById(id);
        if (certOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(certOpt.get());
    }

    // Admin endpoints
    @GetMapping("/admin")
    public List<Certification> getAllAdmin(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Certification.PublicationStatus publicationStatus,
            @RequestParam(required = false) Boolean isVisible) {
        return service.findAllWithFilters(status, publicationStatus, isVisible);
    }

    @PostMapping("/admin")
    public ResponseEntity<Certification> createAdmin(@Valid @RequestBody Certification entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Certification> updateAdmin(@PathVariable Long id, @Valid @RequestBody Certification entity) {
        Certification existing = service.findById(id);
        entity.setId(id);
        entity.setCreatedAt(existing.getCreatedAt());
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/reorder")
    public ResponseEntity<?> reorderCertifications(@RequestBody List<Long> certificationIdsInOrder) {
        service.reorderCertifications(certificationIdsInOrder);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/{id}/publication-status")
    public ResponseEntity<Certification> updatePublicationStatus(
            @PathVariable Long id,
            @RequestParam Certification.PublicationStatus status) {
        return ResponseEntity.ok(service.updatePublicationStatus(id, status));
    }

    @PutMapping("/admin/{id}/visibility")
    public ResponseEntity<Certification> updateVisibility(
            @PathVariable Long id,
            @RequestParam Boolean isVisible) {
        return ResponseEntity.ok(service.updateVisibility(id, isVisible));
    }
}