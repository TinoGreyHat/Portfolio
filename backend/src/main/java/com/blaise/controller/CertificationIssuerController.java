package com.blaise.controller;

import com.blaise.entity.CertificationIssuer;
import com.blaise.service.CertificationIssuerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/certifications/issuers")
public class CertificationIssuerController {

    private final CertificationIssuerService service;

    public CertificationIssuerController(CertificationIssuerService service) {
        this.service = service;
    }

    @GetMapping
    public List<CertificationIssuer> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificationIssuer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<CertificationIssuer> create(@Valid @RequestBody CertificationIssuer entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificationIssuer> update(@PathVariable Long id, @Valid @RequestBody CertificationIssuer entity) {
        CertificationIssuer existing = service.findById(id);
        entity.setId(id);
        entity.setCreatedAt(existing.getCreatedAt());
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}