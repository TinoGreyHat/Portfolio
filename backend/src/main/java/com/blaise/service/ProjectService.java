package com.blaise.service;

import com.blaise.entity.Project;
import com.blaise.entity.ProjectSection;
import com.blaise.repository.ProjectRepository;
import com.blaise.repository.ProjectSectionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository repository;
    private final ProjectSectionRepository sectionRepository;

    public ProjectService(ProjectRepository repository, ProjectSectionRepository sectionRepository) {
        this.repository = repository;
        this.sectionRepository = sectionRepository;
    }

    // Public API - only published projects
    public List<Project> findAllPublished() {
        return repository.findByPublicationStatusOrderByDisplayOrderAsc(Project.PublicationStatus.PUBLISHED);
    }

    // Admin API - all projects with optional filters
    // We fetch projects and then manually populate sections to avoid lazy loading issues
    @Transactional(readOnly = true)
    public List<Project> findAll() {
        List<Project> projects = repository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder"));
        populateSections(projects);
        return projects;
    }

    @Transactional(readOnly = true)
    public List<Project> findAllWithFilters(String category, String status, Project.PublicationStatus publicationStatus) {
        List<Project> projects;
        if (category != null && status != null && publicationStatus != null) {
            projects = repository.findByCategoryAndStatusAndPublicationStatus(category, status, publicationStatus);
        } else if (category != null && status != null) {
            projects = repository.findByCategoryAndStatus(category, status);
        } else if (category != null && publicationStatus != null) {
            projects = repository.findByCategoryAndPublicationStatus(category, publicationStatus);
        } else if (status != null && publicationStatus != null) {
            projects = repository.findByStatusAndPublicationStatus(status, publicationStatus);
        } else if (category != null) {
            projects = repository.findByCategory(category);
        } else if (status != null) {
            projects = repository.findByStatus(status);
        } else if (publicationStatus != null) {
            projects = repository.findByPublicationStatusOrderByDisplayOrderAsc(publicationStatus);
        } else {
            projects = findAll();
            return projects;
        }
        populateSections(projects);
        return projects;
    }

    private void populateSections(List<Project> projects) {
        if (projects.isEmpty()) return;

        List<Long> projectIds = projects.stream().map(Project::getId).toList();
        List<ProjectSection> allSections = sectionRepository.findByProjectIdInOrderByProjectIdAscDisplayOrderAsc(projectIds);

        Map<Long, List<ProjectSection>> sectionsByProject = allSections.stream()
                .collect(Collectors.groupingBy(s -> s.getProject().getId()));

        projects.forEach(project -> {
            List<ProjectSection> sections = sectionsByProject.getOrDefault(project.getId(), List.of());
            project.getSections().clear();
            project.getSections().addAll(sections);
        });
    }

    public Project findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project save(Project entity) {
        if (entity.getDisplayOrder() == null) {
            // Auto-assign display order at the end
            Integer maxOrder = repository.findMaxDisplayOrder();
            entity.setDisplayOrder((maxOrder != null ? maxOrder : -1) + 1);
        }
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void reorderProjects(List<Long> projectIdsInOrder) {
        for (int i = 0; i < projectIdsInOrder.size(); i++) {
            final int displayOrder = i;
            Long projectId = projectIdsInOrder.get(i);
            Project project = repository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
            project.setDisplayOrder(displayOrder);
            repository.save(project);
        }
    }

    public Project updatePublicationStatus(Long id, Project.PublicationStatus status) {
        Project project = findById(id);
        project.setPublicationStatus(status);
        return repository.save(project);
    }
}