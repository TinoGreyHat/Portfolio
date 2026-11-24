package com.blaise.service;

import com.blaise.entity.RoadmapTool;
import com.blaise.entity.RoadmapLevel;
import com.blaise.repository.RoadmapToolRepository;
import com.blaise.repository.RoadmapLevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoadmapToolService {

    private final RoadmapToolRepository repository;
    private final RoadmapLevelRepository levelRepository;

    public RoadmapToolService(RoadmapToolRepository repository, RoadmapLevelRepository levelRepository) {
        this.repository = repository;
        this.levelRepository = levelRepository;
    }

    public List<RoadmapTool> findByLevel(RoadmapLevel level) {
        return repository.findByRoadmapLevelOrderByDisplayOrderAsc(level);
    }

    public RoadmapTool findByIdOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Outil non trouvé : " + id));
    }

    public RoadmapTool save(RoadmapTool entity) {
        return repository.save(entity);
    }

    public RoadmapTool create(RoadmapLevel level, RoadmapTool entity) {
        entity.setRoadmapLevel(level);
        if (entity.getDisplayOrder() == null) {
            int maxOrder = repository.findByRoadmapLevelOrderByDisplayOrderAsc(level)
                    .stream()
                    .mapToInt(RoadmapTool::getDisplayOrder)
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
            repository.findById(id).ifPresent(tool -> {
                tool.setDisplayOrder(displayOrder);
                repository.save(tool);
            });
        }
    }
}