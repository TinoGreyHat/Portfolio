package com.blaise.controller;

import com.blaise.dto.RoadmapLevelDto;
import com.blaise.entity.RoadmapLevel;
import com.blaise.service.RoadmapLevelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final RoadmapLevelService service;

    public RoadmapController(RoadmapLevelService service) {
        this.service = service;
    }

    @GetMapping
    public List<RoadmapLevelDto> getAll() {
        return service.findAll().stream()
                .map(RoadmapLevelDto::fromEntity)
                .toList();
    }

    @GetMapping("/{levelNumber}")
    public ResponseEntity<RoadmapLevelDto> getByLevelNumber(@PathVariable Integer levelNumber) {
        return service.findByLevelNumber(levelNumber)
                .filter(level -> level.getStatus() != RoadmapLevel.LevelStatus.FUTURE)
                .map(level -> ResponseEntity.ok(RoadmapLevelDto.fromEntity(level)))
                .orElse(ResponseEntity.notFound().build());
    }
}