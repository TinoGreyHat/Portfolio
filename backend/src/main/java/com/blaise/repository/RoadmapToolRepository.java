package com.blaise.repository;

import com.blaise.entity.RoadmapLevel;
import com.blaise.entity.RoadmapTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapToolRepository extends JpaRepository<RoadmapTool, Long> {
    List<RoadmapTool> findByRoadmapLevelOrderByDisplayOrderAsc(RoadmapLevel roadmapLevel);
}