package com.blaise.service;

import com.blaise.entity.RoadmapLevel;
import com.blaise.repository.RoadmapLevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoadmapLevelService {

    private final RoadmapLevelRepository repository;

    public RoadmapLevelService(RoadmapLevelRepository repository) {
        this.repository = repository;
    }

    public List<RoadmapLevel> findAll() {
        return repository.findAllByOrderByLevelNumberAsc();
    }

    public Optional<RoadmapLevel> findByLevelNumber(Integer levelNumber) {
        return repository.findByLevelNumber(levelNumber);
    }

    public RoadmapLevel findByIdOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Niveau roadmap non trouvé : " + id));
    }

    public RoadmapLevel save(RoadmapLevel entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public boolean existsByLevelNumber(Integer levelNumber) {
        return repository.existsByLevelNumber(levelNumber);
    }
}