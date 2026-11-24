package com.blaise.repository;

import com.blaise.entity.ProjectSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectSectionRepository extends JpaRepository<ProjectSection, Long> {

    List<ProjectSection> findByProjectIdOrderByDisplayOrderAsc(Long projectId);

    @Query("SELECT ps FROM ProjectSection ps WHERE ps.project.id IN :projectIds ORDER BY ps.project.id ASC, ps.displayOrder ASC")
    List<ProjectSection> findByProjectIdInOrderByProjectIdAscDisplayOrderAsc(List<Long> projectIds);

    @Query("DELETE FROM ProjectSection ps WHERE ps.project.id = :projectId")
    void deleteByProjectId(Long projectId);
}