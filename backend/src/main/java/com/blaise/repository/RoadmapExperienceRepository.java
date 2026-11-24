package com.blaise.repository;

import com.blaise.entity.RoadmapExperience;
import com.blaise.entity.RoadmapLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapExperienceRepository extends JpaRepository<RoadmapExperience, Long> {
    List<RoadmapExperience> findByRoadmapLevelOrderByDisplayOrderAsc(RoadmapLevel roadmapLevel);
}