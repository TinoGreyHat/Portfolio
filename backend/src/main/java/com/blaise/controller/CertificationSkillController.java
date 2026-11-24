package com.blaise.controller;

import com.blaise.entity.Certification;
import com.blaise.entity.CertificationSkill;
import com.blaise.service.CertificationService;
import com.blaise.service.CertificationSkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/certifications/{certificationId}/skills")
public class CertificationSkillController {

    private final CertificationSkillService skillService;
    private final CertificationService certificationService;

    public CertificationSkillController(CertificationSkillService skillService, CertificationService certificationService) {
        this.skillService = skillService;
        this.certificationService = certificationService;
    }

    @GetMapping
    public List<CertificationSkill> getSkills(@PathVariable Long certificationId) {
        certificationService.findById(certificationId); // Validate certification exists
        return skillService.findByCertificationId(certificationId);
    }

    @PostMapping
    public ResponseEntity<CertificationSkill> createSkill(
            @PathVariable Long certificationId,
            @Valid @RequestBody CertificationSkill skill) {
        Certification cert = certificationService.findById(certificationId);
        skill.setCertification(cert);
        // Auto-assign display order at the end
        List<CertificationSkill> existingSkills = skillService.findByCertificationId(certificationId);
        skill.setDisplayOrder(existingSkills.size());
        return ResponseEntity.ok(skillService.save(skill));
    }

    @PutMapping("/{skillId}")
    public ResponseEntity<CertificationSkill> updateSkill(
            @PathVariable Long certificationId,
            @PathVariable Long skillId,
            @Valid @RequestBody CertificationSkill skill) {
        certificationService.findById(certificationId); // Validate certification exists
        CertificationSkill existing = skillService.findByCertificationId(certificationId).stream()
                .filter(s -> s.getId().equals(skillId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Skill not found: " + skillId));
        skill.setId(skillId);
        skill.setCertification(existing.getCertification());
        skill.setCreatedAt(existing.getCreatedAt());
        return ResponseEntity.ok(skillService.save(skill));
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<?> deleteSkill(
            @PathVariable Long certificationId,
            @PathVariable Long skillId) {
        certificationService.findById(certificationId); // Validate certification exists
        skillService.delete(skillId);
        // Reorder remaining skills
        List<CertificationSkill> remaining = skillService.findByCertificationId(certificationId);
        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setDisplayOrder(i);
            skillService.save(remaining.get(i));
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<?> reorderSkills(
            @PathVariable Long certificationId,
            @RequestBody List<Long> skillIdsInOrder) {
        certificationService.findById(certificationId); // Validate certification exists
        skillService.reorderSkills(certificationId, skillIdsInOrder);
        return ResponseEntity.ok().build();
    }
}