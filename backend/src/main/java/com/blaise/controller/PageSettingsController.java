package com.blaise.controller;

import com.blaise.entity.PageSettings;
import com.blaise.service.PageSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/page-settings")
public class PageSettingsController {

    private final PageSettingsService service;

    public PageSettingsController(PageSettingsService service) {
        this.service = service;
    }

    // Public endpoint - get page settings by key
    @GetMapping("/{pageKey}")
    public ResponseEntity<PageSettings> getByPageKey(@PathVariable String pageKey) {
        Optional<PageSettings> settings = service.findByPageKey(pageKey);
        if (settings.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(settings.get());
    }

    // Admin endpoints
    @GetMapping("/admin")
    public List<PageSettings> getAllAdmin() {
        return service.findAll();
    }

    @PostMapping("/admin")
    public ResponseEntity<PageSettings> createAdmin(@Valid @RequestBody PageSettings entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<PageSettings> updateAdmin(@PathVariable Long id, @Valid @RequestBody PageSettings entity) {
        PageSettings existing = service.findById(id);
        entity.setId(id);
        entity.setCreatedAt(existing.getCreatedAt());
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}