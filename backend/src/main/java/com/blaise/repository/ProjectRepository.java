package com.blaise.repository;

import com.blaise.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByCategory(String category);

    List<Project> findByStatus(String status);

    List<Project> findByCategoryAndStatus(String category, String status);

    // Public API - published projects with sections eagerly fetched
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.publicationStatus = :publicationStatus ORDER BY p.displayOrder ASC")
    List<Project> findByPublicationStatusOrderByDisplayOrderAsc(Project.PublicationStatus publicationStatus);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.category = :category AND p.publicationStatus = :publicationStatus ORDER BY p.displayOrder ASC")
    List<Project> findByCategoryAndPublicationStatus(String category, Project.PublicationStatus publicationStatus);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.status = :status AND p.publicationStatus = :publicationStatus ORDER BY p.displayOrder ASC")
    List<Project> findByStatusAndPublicationStatus(String status, Project.PublicationStatus publicationStatus);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.category = :category AND p.status = :status AND p.publicationStatus = :publicationStatus ORDER BY p.displayOrder ASC")
    List<Project> findByCategoryAndStatusAndPublicationStatus(String category, String status, Project.PublicationStatus publicationStatus);

    // Admin API - all projects with sections eagerly fetched
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections ORDER BY p.displayOrder ASC")
    List<Project> findAllWithSections();

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.category = :category ORDER BY p.displayOrder ASC")
    List<Project> findByCategoryWithSections(String category);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.status = :status ORDER BY p.displayOrder ASC")
    List<Project> findByStatusWithSections(String status);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.category = :category AND p.status = :status ORDER BY p.displayOrder ASC")
    List<Project> findByCategoryAndStatusWithSections(String category, String status);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.publicationStatus = :publicationStatus ORDER BY p.displayOrder ASC")
    List<Project> findByPublicationStatusOrderByDisplayOrderAscWithSections(Project.PublicationStatus publicationStatus);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.category = :category AND p.publicationStatus = :publicationStatus ORDER BY p.displayOrder ASC")
    List<Project> findByCategoryAndPublicationStatusWithSections(String category, Project.PublicationStatus publicationStatus);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.status = :status AND p.publicationStatus = :publicationStatus ORDER BY p.displayOrder ASC")
    List<Project> findByStatusAndPublicationStatusWithSections(String status, Project.PublicationStatus publicationStatus);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.sections WHERE p.category = :category AND p.status = :status AND p.publicationStatus = :publicationStatus ORDER BY p.displayOrder ASC")
    List<Project> findByCategoryAndStatusAndPublicationStatusWithSections(String category, String status, Project.PublicationStatus publicationStatus);

    @Query("SELECT MAX(p.displayOrder) FROM Project p")
    Integer findMaxDisplayOrder();
}