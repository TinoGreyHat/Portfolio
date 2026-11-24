package com.blaise.service;

import com.blaise.entity.RoadmapCertification;
import com.blaise.entity.RoadmapLevel;
import com.blaise.repository.RoadmapCertificationRepository;
import com.blaise.repository.RoadmapLevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoadmapCertificationService {

    private final RoadmapCertificationRepository repository;
    private final RoadmapLevelRepository levelRepository;

    public RoadmapCertificationService(RoadmapCertificationRepository repository, RoadmapLevelRepository levelRepository) {
        this.repository = repository;
        this.levelRepository = levelRepository;
    }

    public List<RoadmapCertification> findByLevel(RoadmapLevel level) {
        return repository.findByRoadmapLevelOrderByIdAsc(level);
    }

    public RoadmapCertification findByIdOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification non trouvée : " + id));
    }

    public RoadmapCertification save(RoadmapCertification entity) {
        return repository.save(entity);
    }

    public RoadmapCertification create(RoadmapLevel level, RoadmapCertification entity) {
        entity.setRoadmapLevel(level);
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}