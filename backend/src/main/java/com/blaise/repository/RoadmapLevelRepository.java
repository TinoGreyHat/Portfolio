package com.blaise.repository;

import com.blaise.entity.RoadmapLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadmapLevelRepository extends JpaRepository<RoadmapLevel, Long> {
    Optional<RoadmapLevel> findByLevelNumber(Integer levelNumber);
    boolean existsByLevelNumber(Integer levelNumber);
    List<RoadmapLevel> findAllByOrderByLevelNumberAsc();
}