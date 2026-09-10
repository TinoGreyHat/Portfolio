package com.blaise.controller;

import com.blaise.entity.Veille;
import com.blaise.service.VeilleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/veilles")
public class VeilleController {

    private final VeilleService service;

    public VeilleController(VeilleService service) {
        this.service = service;
    }

    @GetMapping
    public List<Veille> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veille> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Veille> create(@Valid @RequestBody Veille entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Veille> update(@PathVariable Long id, @Valid @RequestBody Veille entity) {
        Veille existing = service.findById(id);
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
