package com.blaise.controller;

import com.blaise.dto.RoadmapCertificationDto;
import com.blaise.dto.RoadmapExperienceDto;
import com.blaise.dto.RoadmapLevelDto;
import com.blaise.dto.RoadmapToolDto;
import com.blaise.entity.RoadmapLevel;
import com.blaise.service.RoadmapCertificationService;
import com.blaise.service.RoadmapExperienceService;
import com.blaise.service.RoadmapLevelService;
import com.blaise.service.RoadmapToolService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/roadmap")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRoadmapController {

    private final RoadmapLevelService levelService;
    private final RoadmapExperienceService experienceService;
    private final RoadmapCertificationService certificationService;
    private final RoadmapToolService toolService;

    public AdminRoadmapController(RoadmapLevelService levelService,
                                   RoadmapExperienceService experienceService,
                                   RoadmapCertificationService certificationService,
                                   RoadmapToolService toolService) {
        this.levelService = levelService;
        this.experienceService = experienceService;
        this.certificationService = certificationService;
        this.toolService = toolService;
    }

    // --- Level ---

    @PutMapping("/{levelNumber}")
    public ResponseEntity<RoadmapLevelDto> updateLevel(@PathVariable Integer levelNumber,
                                                        @Valid @RequestBody RoadmapLevelDto dto) {
        RoadmapLevel level = levelService.findByLevelNumber(levelNumber)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé : " + levelNumber));
        dto.updateEntity(level);
        return ResponseEntity.ok(RoadmapLevelDto.fromEntity(levelService.save(level)));
    }

    // --- Experiences ---

    @PostMapping("/{levelNumber}/experiences")
    public ResponseEntity<RoadmapExperienceDto> createExperience(@PathVariable Integer levelNumber,
                                                                  @Valid @RequestBody RoadmapExperienceDto dto) {
        RoadmapLevel level = levelService.findByLevelNumber(levelNumber)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé : " + levelNumber));
        RoadmapExperienceDto saved = RoadmapExperienceDto.fromEntity(
                experienceService.create(level, dto.toEntity()));
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/experiences/{id}")
    public ResponseEntity<RoadmapExperienceDto> updateExperience(@PathVariable Long id,
                                                                  @Valid @RequestBody RoadmapExperienceDto dto) {
        RoadmapExperienceDto existing = RoadmapExperienceDto.fromEntity(
                experienceService.findByIdOrThrow(id));
        existing.setDescription(dto.getDescription());
        existing.setDisplayOrder(dto.getDisplayOrder());
        RoadmapExperienceDto saved = RoadmapExperienceDto.fromEntity(
                experienceService.save(existing.toEntity()));
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/experiences/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        experienceService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{levelNumber}/experiences/reorder")
    public ResponseEntity<Void> reorderExperiences(@PathVariable Integer levelNumber,
                                                    @RequestBody List<Long> orderedIds) {
        RoadmapLevel level = levelService.findByLevelNumber(levelNumber)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé : " + levelNumber));
        experienceService.reorder(level, orderedIds);
        return ResponseEntity.ok().build();
    }

    // --- Certifications ---

    @PostMapping("/{levelNumber}/certifications")
    public ResponseEntity<RoadmapCertificationDto> createCertification(@PathVariable Integer levelNumber,
                                                                        @Valid @RequestBody RoadmapCertificationDto dto) {
        RoadmapLevel level = levelService.findByLevelNumber(levelNumber)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé : " + levelNumber));
        RoadmapCertificationDto saved = RoadmapCertificationDto.fromEntity(
                certificationService.create(level, dto.toEntity()));
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/certifications/{id}")
    public ResponseEntity<RoadmapCertificationDto> updateCertification(@PathVariable Long id,
                                                                        @Valid @RequestBody RoadmapCertificationDto dto) {
        RoadmapCertificationDto existing = RoadmapCertificationDto.fromEntity(
                certificationService.findByIdOrThrow(id));
        existing.setName(dto.getName());
        existing.setOrganization(dto.getOrganization());
        existing.setObtainedDate(dto.getObtainedDate());
        existing.setCertificateUrl(dto.getCertificateUrl());
        RoadmapCertificationDto saved = RoadmapCertificationDto.fromEntity(
                certificationService.save(existing.toEntity()));
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/certifications/{id}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id) {
        certificationService.delete(id);
        return ResponseEntity.ok().build();
    }

    // --- Tools ---

    @PostMapping("/{levelNumber}/tools")
    public ResponseEntity<RoadmapToolDto> createTool(@PathVariable Integer levelNumber,
                                                      @Valid @RequestBody RoadmapToolDto dto) {
        RoadmapLevel level = levelService.findByLevelNumber(levelNumber)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé : " + levelNumber));
        RoadmapToolDto saved = RoadmapToolDto.fromEntity(
                toolService.create(level, dto.toEntity()));
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/tools/{id}")
    public ResponseEntity<RoadmapToolDto> updateTool(@PathVariable Long id,
                                                      @Valid @RequestBody RoadmapToolDto dto) {
        RoadmapToolDto existing = RoadmapToolDto.fromEntity(toolService.findByIdOrThrow(id));
        existing.setName(dto.getName());
        existing.setDisplayOrder(dto.getDisplayOrder());
        RoadmapToolDto saved = RoadmapToolDto.fromEntity(toolService.save(existing.toEntity()));
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/tools/{id}")
    public ResponseEntity<Void> deleteTool(@PathVariable Long id) {
        toolService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{levelNumber}/tools/reorder")
    public ResponseEntity<Void> reorderTools(@PathVariable Integer levelNumber,
                                              @RequestBody List<Long> orderedIds) {
        RoadmapLevel level = levelService.findByLevelNumber(levelNumber)
                .orElseThrow(() -> new RuntimeException("Niveau non trouvé : " + levelNumber));
        toolService.reorder(level, orderedIds);
        return ResponseEntity.ok().build();
    }
}