package com.blaise.repository;

import com.blaise.entity.RoadmapCertification;
import com.blaise.entity.RoadmapLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapCertificationRepository extends JpaRepository<RoadmapCertification, Long> {
    List<RoadmapCertification> findByRoadmapLevelOrderByIdAsc(RoadmapLevel roadmapLevel);
}