package com.blaise.controller;

import com.blaise.entity.Certification;
import com.blaise.entity.CertificationDetail;
import com.blaise.service.CertificationDetailService;
import com.blaise.service.CertificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/certifications/{certificationId}/details")
public class CertificationDetailController {

    private final CertificationDetailService detailService;
    private final CertificationService certificationService;

    public CertificationDetailController(CertificationDetailService detailService, CertificationService certificationService) {
        this.detailService = detailService;
        this.certificationService = certificationService;
    }

    @GetMapping
    public List<CertificationDetail> getDetails(@PathVariable Long certificationId) {
        certificationService.findById(certificationId); // Validate certification exists
        return detailService.findByCertificationId(certificationId);
    }

    @PostMapping
    public ResponseEntity<CertificationDetail> createDetail(
            @PathVariable Long certificationId,
            @Valid @RequestBody CertificationDetail detail) {
        Certification cert = certificationService.findById(certificationId);
        detail.setCertification(cert);
        // Auto-assign display order at the end
        List<CertificationDetail> existingDetails = detailService.findByCertificationId(certificationId);
        detail.setDisplayOrder(existingDetails.size());
        return ResponseEntity.ok(detailService.save(detail));
    }

    @PutMapping("/{detailId}")
    public ResponseEntity<CertificationDetail> updateDetail(
            @PathVariable Long certificationId,
            @PathVariable Long detailId,
            @Valid @RequestBody CertificationDetail detail) {
        certificationService.findById(certificationId); // Validate certification exists
        CertificationDetail existing = detailService.findByCertificationId(certificationId).stream()
                .filter(d -> d.getId().equals(detailId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Detail not found: " + detailId));
        detail.setId(detailId);
        detail.setCertification(existing.getCertification());
        detail.setCreatedAt(existing.getCreatedAt());
        return ResponseEntity.ok(detailService.save(detail));
    }

    @DeleteMapping("/{detailId}")
    public ResponseEntity<?> deleteDetail(
            @PathVariable Long certificationId,
            @PathVariable Long detailId) {
        certificationService.findById(certificationId); // Validate certification exists
        detailService.delete(detailId);
        // Reorder remaining details
        List<CertificationDetail> remaining = detailService.findByCertificationId(certificationId);
        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setDisplayOrder(i);
            detailService.save(remaining.get(i));
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<?> reorderDetails(
            @PathVariable Long certificationId,
            @RequestBody List<Long> detailIdsInOrder) {
        certificationService.findById(certificationId); // Validate certification exists
        detailService.reorderDetails(certificationId, detailIdsInOrder);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{detailId}/duplicate")
    public ResponseEntity<CertificationDetail> duplicateDetail(
            @PathVariable Long certificationId,
            @PathVariable Long detailId) {
        certificationService.findById(certificationId); // Validate certification exists
        return ResponseEntity.ok(detailService.duplicateDetail(detailId));
    }
}