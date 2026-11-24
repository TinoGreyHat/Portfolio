package com.blaise.controller;

import com.blaise.entity.Project;
import com.blaise.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    // Public endpoint - only published projects
    @GetMapping
    public List<Project> getAll() {
        return service.findAllPublished();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        Project project = service.findById(id);
        if (project.getPublicationStatus() != Project.PublicationStatus.PUBLISHED) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(project);
    }

    // Admin endpoints
    @GetMapping("/admin")
    public List<Project> getAllAdmin(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Project.PublicationStatus publicationStatus) {
        return service.findAllWithFilters(category, status, publicationStatus);
    }

    @PostMapping("/admin")
    public ResponseEntity<Project> createAdmin(@Valid @RequestBody Project entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Project> updateAdmin(@PathVariable Long id, @Valid @RequestBody Project entity) {
        Project existing = service.findById(id);
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
    public ResponseEntity<?> reorderProjects(@RequestBody List<Long> projectIdsInOrder) {
        service.reorderProjects(projectIdsInOrder);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/{id}/publication-status")
    public ResponseEntity<Project> updatePublicationStatus(
            @PathVariable Long id,
            @RequestParam Project.PublicationStatus status) {
        return ResponseEntity.ok(service.updatePublicationStatus(id, status));
    }
}