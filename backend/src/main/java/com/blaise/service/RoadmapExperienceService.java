package com.blaise.service;

import com.blaise.entity.RoadmapExperience;
import com.blaise.entity.RoadmapLevel;
import com.blaise.repository.RoadmapExperienceRepository;
import com.blaise.repository.RoadmapLevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoadmapExperienceService {

    private final RoadmapExperienceRepository repository;
    private final RoadmapLevelRepository levelRepository;

    public RoadmapExperienceService(RoadmapExperienceRepository repository, RoadmapLevelRepository levelRepository) {
        this.repository = repository;
        this.levelRepository = levelRepository;
    }

    public List<RoadmapExperience> findByLevel(RoadmapLevel level) {
        return repository.findByRoadmapLevelOrderByDisplayOrderAsc(level);
    }

    public RoadmapExperience findByIdOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expérience non trouvée : " + id));
    }

    public RoadmapExperience save(RoadmapExperience entity) {
        return repository.save(entity);
    }

    public RoadmapExperience create(RoadmapLevel level, RoadmapExperience entity) {
        entity.setRoadmapLevel(level);
        if (entity.getDisplayOrder() == null) {
            int maxOrder = repository.findByRoadmapLevelOrderByDisplayOrderAsc(level)
                    .stream()
                    .mapToInt(RoadmapExperience::getDisplayOrder)
                    .max()
                    .orElse(-1);
            entity.setDisplayOrder(maxOrder + 1);
        }
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void reorder(RoadmapLevel level, List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            final int displayOrder = i; // effectively final for lambda
            repository.findById(id).ifPresent(exp -> {
                exp.setDisplayOrder(displayOrder);
                repository.save(exp);
            });
        }
    }
}