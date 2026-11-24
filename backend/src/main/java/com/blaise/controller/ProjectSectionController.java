package com.blaise.controller;

import com.blaise.entity.Project;
import com.blaise.entity.ProjectSection;
import com.blaise.service.ProjectSectionService;
import com.blaise.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects/{projectId}/sections")
public class ProjectSectionController {

    private final ProjectSectionService sectionService;
    private final ProjectService projectService;

    public ProjectSectionController(ProjectSectionService sectionService, ProjectService projectService) {
        this.sectionService = sectionService;
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectSection> getSections(@PathVariable Long projectId) {
        projectService.findById(projectId); // Validate project exists
        return sectionService.findByProjectId(projectId);
    }

    @PostMapping
    public ResponseEntity<ProjectSection> createSection(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectSection section) {
        Project project = projectService.findById(projectId);
        section.setProject(project);
        // Auto-assign display order at the end
        List<ProjectSection> existingSections = sectionService.findByProjectId(projectId);
        section.setDisplayOrder(existingSections.size());
        return ResponseEntity.ok(sectionService.save(section));
    }

    @PutMapping("/{sectionId}")
    public ResponseEntity<ProjectSection> updateSection(
            @PathVariable Long projectId,
            @PathVariable Long sectionId,
            @Valid @RequestBody ProjectSection section) {
        projectService.findById(projectId); // Validate project exists
        ProjectSection existing = sectionService.findByProjectId(projectId).stream()
                .filter(s -> s.getId().equals(sectionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Section not found: " + sectionId));
        section.setId(sectionId);
        section.setProject(existing.getProject());
        section.setCreatedAt(existing.getCreatedAt());
        return ResponseEntity.ok(sectionService.save(section));
    }

    @DeleteMapping("/{sectionId}")
    public ResponseEntity<?> deleteSection(
            @PathVariable Long projectId,
            @PathVariable Long sectionId) {
        projectService.findById(projectId); // Validate project exists
        sectionService.delete(sectionId);
        // Reorder remaining sections
        List<ProjectSection> remaining = sectionService.findByProjectId(projectId);
        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setDisplayOrder(i);
            sectionService.save(remaining.get(i));
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<?> reorderSections(
            @PathVariable Long projectId,
            @RequestBody List<Long> sectionIdsInOrder) {
        projectService.findById(projectId); // Validate project exists
        sectionService.reorderSections(projectId, sectionIdsInOrder);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{sectionId}/duplicate")
    public ResponseEntity<ProjectSection> duplicateSection(
            @PathVariable Long projectId,
            @PathVariable Long sectionId) {
        projectService.findById(projectId); // Validate project exists
        return ResponseEntity.ok(sectionService.duplicateSection(sectionId));
    }
}